package com.sneaker.backend.service.impl;

import com.sneaker.backend.dto.coupon.CouponCalculation;
import com.sneaker.backend.dto.order.OrderRequest;
import com.sneaker.backend.dto.order.OrderResponse;
import com.sneaker.backend.entity.Cart;
import com.sneaker.backend.entity.CartItem;
import com.sneaker.backend.entity.Order;
import com.sneaker.backend.entity.OrderItem;
import com.sneaker.backend.entity.ProductVariantSize;
import com.sneaker.backend.entity.ShippingAddress;
import com.sneaker.backend.entity.User;
import com.sneaker.backend.mapper.OrderMapper;
import com.sneaker.backend.repository.CartRepository;
import com.sneaker.backend.repository.OrderRepository;
import com.sneaker.backend.repository.ProductVariantSizeRepository;
import com.sneaker.backend.repository.UserRepository;
import com.sneaker.backend.service.CouponService;
import com.sneaker.backend.service.DiscountService;
import com.sneaker.backend.service.EmailService;
import com.sneaker.backend.service.OrderService;
import com.sneaker.backend.service.ShippingAddressService;
import com.sneaker.backend.service.ShippingFeeService;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;

@Service
public class OrderServiceImpl implements OrderService {

    @Autowired
    private OrderRepository orderRepository;

    @Autowired
    private CartRepository cartRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private ProductVariantSizeRepository variantSizeRepository;

    @Autowired
    private CouponService couponService;

    @Autowired
    private DiscountService discountService;

    @Autowired
    private EmailService emailService;

    @Autowired
    private ShippingAddressService shippingAddressService;

    @Autowired
    private ShippingFeeService shippingFeeService;

    @Autowired
    private OrderMapper orderMapper;

    @Override
    @Transactional
    public OrderResponse placeOrder(OrderRequest request) {
        Long currentUserId = getCurrentUserId();

        User user = userRepository.findById(currentUserId)
                .orElseThrow(() -> new RuntimeException("Người dùng không tồn tại"));

        Cart cart = cartRepository.findByUserId(currentUserId)
                .orElseThrow(() -> new RuntimeException("Giỏ hàng không tồn tại"));

        if (cart.getItems().isEmpty()) {
            throw new RuntimeException("Giỏ hàng đang trống!");
        }

        Order order = new Order();
        order.setUser(user);
        ShippingSnapshot shippingSnapshot = resolveShippingSnapshot(request, currentUserId);
        order.setReceiverName(shippingSnapshot.receiverName());
        order.setReceiverPhone(shippingSnapshot.receiverPhone());
        order.setShippingAddress(shippingSnapshot.fullAddress());
        order.setShippingAddressId(shippingSnapshot.addressId());
        order.setNote(request.getNote());
        order.setPaymentMethod(request.getPaymentMethod());
        order.setPaymentStatus("COD".equals(request.getPaymentMethod()) ? "COD_PENDING" : "UNPAID");
        order.setItems(new ArrayList<>());

        for (CartItem cartItem : cart.getItems()) {
            ProductVariantSize variantSize = cartItem.getVariantSize();

            if (variantSize.getQuantity() < cartItem.getQuantity()) {
                throw new RuntimeException("Sản phẩm " + variantSize.getVariant().getProduct().getName()
                        + " hiện không đủ số lượng trong kho.");
            }

            variantSize.setQuantity(variantSize.getQuantity() - cartItem.getQuantity());
            variantSizeRepository.save(variantSize);

            double currentPrice = discountService.getFinalPrice(variantSize.getVariant().getProduct());

            OrderItem orderItem = new OrderItem();
            orderItem.setOrder(order);
            orderItem.setVariantSize(variantSize);
            orderItem.setQuantity(cartItem.getQuantity());
            orderItem.setPrice(currentPrice);

            order.getItems().add(orderItem);
        }

        CouponCalculation couponCalculation = couponService.calculate(cart, request.getCouponCode());
        double shippingFee = shippingFeeService.calculateFee(shippingSnapshot.regionSource(), couponCalculation.getSubtotalAmount());
        double finalAmount = Math.max(0D, couponCalculation.getFinalAmount()) + shippingFee;

        order.setSubtotalAmount(couponCalculation.getSubtotalAmount());
        order.setDiscountCode(couponCalculation.getCouponCode());
        order.setDiscountAmount(couponCalculation.getDiscountAmount());
        order.setShippingFee(shippingFee);
        order.setShippingRegion(shippingFeeService.resolveRegion(shippingSnapshot.regionSource()));
        order.setFinalAmount(finalAmount);
        order.setTotalAmount(finalAmount);

        Order savedOrder = orderRepository.save(order);
        couponService.markCouponUsed(couponCalculation.getCouponCode());
        emailService.sendOrderPlacedEmail(savedOrder);

        cart.getItems().clear();
        cartRepository.save(cart);

        return orderMapper.toDTO(savedOrder);
    }

    @Override
    @Transactional
    public OrderResponse getOrderById(Long id) {
        Order order = orderRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy đơn hàng với mã số này."));

        Long currentUserId = getCurrentUserId();

        if (!order.getUser().getId().equals(currentUserId)) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Forbidden");
        }

        return orderMapper.toDTO(order);
    }

    @Override
    @Transactional
    public List<OrderResponse> getMyOrders() {
        Long currentUserId = getCurrentUserId();

        return orderRepository.findByUserId(currentUserId).stream()
                .sorted(Comparator.comparing(Order::getCreatedAt).reversed())
                .map(orderMapper::toDTO)
                .toList();
    }

    @Override
    @Transactional
    public OrderResponse cancelOrder(Long id, String reason) {
        Order order = orderRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Order not found"));

        Long currentUserId = getCurrentUserId();
        if (!order.getUser().getId().equals(currentUserId)) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Forbidden");
        }

        if ("CANCELLED".equals(order.getStatus())) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Order is already cancelled");
        }

        if (!"PENDING".equals(order.getStatus())) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Only pending orders can be cancelled");
        }

        order.setStatus("CANCELLED");
        if ("PAID".equals(order.getPaymentStatus())) {
            order.setPaymentStatus("REFUND_PENDING");
        } else if ("COD_PENDING".equals(order.getPaymentStatus())) {
            order.setPaymentStatus("COD_PENDING");
        } else {
            order.setPaymentStatus("FAILED");
        }
        order.setCancelReason(reason.trim());
        order.setCancelledAt(LocalDateTime.now());

        for (OrderItem item : order.getItems()) {
            ProductVariantSize variantSize = item.getVariantSize();
            variantSize.setQuantity(variantSize.getQuantity() + item.getQuantity());
            variantSizeRepository.save(variantSize);
        }

        couponService.releaseCouponUsage(order.getDiscountCode());

        Order savedOrder = orderRepository.save(order);
        emailService.sendOrderCancelledEmail(savedOrder);
        return orderMapper.toDTO(savedOrder);
    }

    private String getCurrentUsername() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();

        if (auth == null || auth.getPrincipal() == null || !auth.isAuthenticated()) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Unauthenticated");
        }

        return auth.getName();
    }

    private Long getCurrentUserId() {
        String username = getCurrentUsername();

        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));

        return user.getId();
    }

    private ShippingSnapshot resolveShippingSnapshot(OrderRequest request, Long currentUserId) {
        if (request.getShippingAddressId() != null) {
            ShippingAddress address = shippingAddressService.getOwnedAddressEntity(request.getShippingAddressId(), currentUserId);
            return new ShippingSnapshot(
                    address.getId(),
                    address.getReceiverName(),
                    address.getReceiverPhone(),
                    address.getFullAddress(),
                    address.getProvince()
            );
        }

        return new ShippingSnapshot(
                null,
                request.getReceiverName(),
                request.getReceiverPhone(),
                request.getShippingAddress(),
                request.getShippingAddress()
        );
    }

    private record ShippingSnapshot(Long addressId, String receiverName, String receiverPhone, String fullAddress, String regionSource) {
    }
}
