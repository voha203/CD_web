package com.sneaker.backend.service.impl;

import com.sneaker.backend.dto.order.OrderResponse;
import com.sneaker.backend.dto.order.OrderRequest;
import com.sneaker.backend.entity.*;
import com.sneaker.backend.mapper.OrderMapper;
import com.sneaker.backend.repository.CartRepository;
import com.sneaker.backend.repository.OrderRepository;
import com.sneaker.backend.repository.ProductVariantSizeRepository;
import com.sneaker.backend.repository.UserRepository;
import com.sneaker.backend.service.OrderService;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;

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
    private OrderMapper orderMapper;

    @Override
    @Transactional
    public OrderResponse placeOrder(OrderRequest request) {
        Long currentUserId = getCurrentUserId();

        // Lấy thông tin khách hàng và giỏ hàng
        User user = userRepository.findById(currentUserId)
                .orElseThrow(() -> new RuntimeException("Người dùng không tồn tại"));

        Cart cart = cartRepository.findByUserId(currentUserId)
                .orElseThrow(() -> new RuntimeException("Giỏ hàng không tồn tại"));

        if (cart.getItems().isEmpty()) {
            throw new RuntimeException("Giỏ hàng đang trống!");
        }

        // Khởi tạo thực thể Order từ thông tin Request
        Order order = new Order();
        order.setUser(user);
        order.setReceiverName(request.getReceiverName());
        order.setReceiverPhone(request.getReceiverPhone());
        order.setShippingAddress(request.getShippingAddress());
        order.setNote(request.getNote());
        order.setPaymentMethod(request.getPaymentMethod());
        order.setItems(new ArrayList<>()); // Khởi tạo list trống để add vào sau

        double totalAmount = 0;

        // Chuyển đổi từ CartItem sang OrderItem & Xử lý Kho
        for (CartItem cartItem : cart.getItems()) {
            ProductVariantSize variantSize = cartItem.getVariantSize();

            // KIỂM TRA TỒN KHO
            if (variantSize.getQuantity() < cartItem.getQuantity()) {
                throw new RuntimeException("Sản phẩm " + variantSize.getVariant().getProduct().getName()
                        + " hiện không đủ số lượng trong kho.");
            }

            // TRỪ KHO
            variantSize.setQuantity(variantSize.getQuantity() - cartItem.getQuantity());
            variantSizeRepository.save(variantSize);

            // TẠO ORDER ITEM (Chốt giá tại thời điểm mua)
            double currentPrice = variantSize.getVariant().getProduct().getPrice();

            OrderItem orderItem = new OrderItem();
            orderItem.setOrder(order);
            orderItem.setVariantSize(variantSize);
            orderItem.setQuantity(cartItem.getQuantity());
            orderItem.setPrice(currentPrice); // Lưu cứng giá vào đây

            totalAmount += currentPrice * cartItem.getQuantity();
            order.getItems().add(orderItem);
        }

        order.setTotalAmount(totalAmount);

        // Lưu đơn hàng vào DB
        Order savedOrder = orderRepository.save(order);

        // DỌN DẸP GIỎ HÀNG (Xóa các item đã mua)
        cart.getItems().clear();
        cartRepository.save(cart);

        return orderMapper.toDTO(savedOrder);
    }

    @Override
    public OrderResponse getOrderById(Long id) {
        Order order = orderRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy đơn hàng với mã số này."));

        return orderMapper.toDTO(order);
    }

    private String getCurrentUsername() {
//        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
//
//        if (auth == null || auth.getPrincipal() == null) {
//            throw new RuntimeException("Unauthenticated");
//        }
//
//        return auth.getPrincipal().toString();
        return "admin";
    }

    private Long getCurrentUserId() {
        String username = getCurrentUsername();

        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));

        return user.getId();
    }
}