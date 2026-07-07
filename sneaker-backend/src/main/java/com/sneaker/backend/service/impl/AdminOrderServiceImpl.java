package com.sneaker.backend.service.impl;

import com.sneaker.backend.dto.admin.AdminOrderItemResponse;
import com.sneaker.backend.dto.admin.AdminOrderResponse;
import com.sneaker.backend.dto.admin.UpdateOrderStatusRequest;
import com.sneaker.backend.dto.admin.UpdatePaymentStatusRequest;
import com.sneaker.backend.dto.productImage.ProductImageResponse;
import com.sneaker.backend.entity.Order;
import com.sneaker.backend.entity.OrderItem;
import com.sneaker.backend.entity.Product;
import com.sneaker.backend.entity.ProductImage;
import com.sneaker.backend.entity.ProductVariantSize;
import com.sneaker.backend.entity.User;
import com.sneaker.backend.repository.OrderRepository;
import com.sneaker.backend.repository.ProductVariantSizeRepository;
import com.sneaker.backend.service.AdminOrderService;
import com.sneaker.backend.service.CouponService;
import com.sneaker.backend.service.EmailService;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.time.LocalDateTime;
import java.util.Comparator;
import java.util.List;
import java.util.Locale;
import java.util.Set;

@Service
public class AdminOrderServiceImpl implements AdminOrderService {

    private static final Set<String> ORDER_STATUSES = Set.of("PENDING", "PROCESSING", "SHIPPED", "DELIVERED", "CANCELLED");
    private static final Set<String> PAYMENT_STATUSES = Set.of("UNPAID", "PAID", "COD_PENDING", "FAILED", "REFUND_PENDING", "REFUNDED");

    @Autowired
    private OrderRepository orderRepository;

    @Autowired
    private ProductVariantSizeRepository variantSizeRepository;

    @Autowired
    private CouponService couponService;

    @Autowired
    private EmailService emailService;

    @Override
    public List<AdminOrderResponse> getOrders(String status, String paymentStatus, String keyword) {
        String normalizedStatus = normalize(status);
        String normalizedPaymentStatus = normalize(paymentStatus);
        String normalizedKeyword = keyword == null ? "" : keyword.trim().toLowerCase(Locale.ROOT);

        return orderRepository.findAll().stream()
                .filter(order -> normalizedStatus == null || normalizedStatus.equals(order.getStatus()))
                .filter(order -> normalizedPaymentStatus == null || normalizedPaymentStatus.equals(order.getPaymentStatus()))
                .filter(order -> matchesKeyword(order, normalizedKeyword))
                .sorted(Comparator.comparing(Order::getCreatedAt, Comparator.nullsLast(Comparator.naturalOrder())).reversed())
                .map(this::toResponse)
                .toList();
    }

    @Override
    public AdminOrderResponse getOrderById(Long id) {
        return toResponse(findOrder(id));
    }

    @Override
    @Transactional
    public AdminOrderResponse updateStatus(Long id, UpdateOrderStatusRequest request) {
        Order order = findOrder(id);
        String nextStatus = normalizeRequired(request.getStatus(), ORDER_STATUSES, "Trạng thái đơn hàng không hợp lệ");

        if (nextStatus.equals(order.getStatus())) {
            return toResponse(order);
        }

        validateStatusTransition(order, nextStatus);

        if ("CANCELLED".equals(nextStatus)) {
            cancelOrder(order, request.getCancelReason());
            emailService.sendOrderCancelledEmail(order);
        } else {
            order.setStatus(nextStatus);
        }

        return toResponse(orderRepository.save(order));
    }

    @Override
    @Transactional
    public AdminOrderResponse updatePaymentStatus(Long id, UpdatePaymentStatusRequest request) {
        Order order = findOrder(id);
        String nextStatus = normalizeRequired(request.getPaymentStatus(), PAYMENT_STATUSES, "Trạng thái thanh toán không hợp lệ");

        if ("REFUNDED".equals(nextStatus) && !"REFUND_PENDING".equals(order.getPaymentStatus())) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Chỉ đơn đang chờ hoàn tiền mới được xác nhận hoàn tiền");
        }

        if ("CANCELLED".equals(order.getStatus()) && "PAID".equals(nextStatus)) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Không thể đánh dấu đã thanh toán cho đơn đã hủy");
        }

        order.setPaymentStatus(nextStatus);
        return toResponse(orderRepository.save(order));
    }

    @Override
    @Transactional
    public AdminOrderResponse confirmRefund(Long id) {
        Order order = findOrder(id);

        if (!"REFUND_PENDING".equals(order.getPaymentStatus())) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Đơn hàng không ở trạng thái chờ hoàn tiền");
        }

        order.setPaymentStatus("REFUNDED");
        return toResponse(orderRepository.save(order));
    }

    private Order findOrder(Long id) {
        return orderRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Không tìm thấy đơn hàng"));
    }

    private void validateStatusTransition(Order order, String nextStatus) {
        String currentStatus = order.getStatus();

        if ("CANCELLED".equals(currentStatus)) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Đơn đã hủy không thể chuyển trạng thái");
        }

        if ("DELIVERED".equals(currentStatus)) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Đơn đã giao không thể chuyển về trạng thái khác");
        }

        if ("CANCELLED".equals(nextStatus) && !Set.of("PENDING", "PROCESSING").contains(currentStatus)) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Chỉ đơn chờ xử lý hoặc đang xử lý mới có thể hủy");
        }

        if (statusRank(nextStatus) < statusRank(currentStatus)) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Không thể chuyển lùi trạng thái đơn hàng");
        }
    }

    private int statusRank(String status) {
        return switch (status) {
            case "PENDING" -> 1;
            case "PROCESSING" -> 2;
            case "SHIPPED" -> 3;
            case "DELIVERED" -> 4;
            case "CANCELLED" -> 5;
            default -> 0;
        };
    }

    private void cancelOrder(Order order, String reason) {
        order.setStatus("CANCELLED");
        order.setCancelReason((reason == null || reason.trim().isEmpty()) ? "Admin hủy đơn hàng" : reason.trim());
        order.setCancelledAt(LocalDateTime.now());

        if ("PAID".equals(order.getPaymentStatus())) {
            order.setPaymentStatus("REFUND_PENDING");
        } else if (!"COD_PENDING".equals(order.getPaymentStatus())) {
            order.setPaymentStatus("FAILED");
        }

        for (OrderItem item : order.getItems()) {
            ProductVariantSize variantSize = item.getVariantSize();
            variantSize.setQuantity(variantSize.getQuantity() + item.getQuantity());
            variantSizeRepository.save(variantSize);
        }

        couponService.releaseCouponUsage(order.getDiscountCode());
    }

    private boolean matchesKeyword(Order order, String keyword) {
        if (keyword.isEmpty()) return true;

        User user = order.getUser();
        return String.valueOf(order.getId()).contains(keyword)
                || contains(user.getUsername(), keyword)
                || contains(user.getFullName(), keyword)
                || contains(order.getReceiverName(), keyword)
                || contains(order.getReceiverPhone(), keyword)
                || contains(user.getPhone(), keyword);
    }

    private boolean contains(String value, String keyword) {
        return value != null && value.toLowerCase(Locale.ROOT).contains(keyword);
    }

    private String normalize(String value) {
        if (value == null || value.trim().isEmpty() || "ALL".equalsIgnoreCase(value)) return null;
        return value.trim().toUpperCase(Locale.ROOT);
    }

    private String normalizeRequired(String value, Set<String> allowedValues, String message) {
        String normalized = normalize(value);
        if (normalized == null || !allowedValues.contains(normalized)) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, message);
        }
        return normalized;
    }

    private AdminOrderResponse toResponse(Order order) {
        User user = order.getUser();

        return AdminOrderResponse.builder()
                .orderId(order.getId())
                .userId(user.getId())
                .username(user.getUsername())
                .fullName(user.getFullName())
                .email(user.getEmail())
                .phone(user.getPhone())
                .receiverName(order.getReceiverName())
                .receiverPhone(order.getReceiverPhone())
                .shippingAddress(order.getShippingAddress())
                .shippingAddressId(order.getShippingAddressId())
                .shippingFee(order.getShippingFee())
                .shippingRegion(order.getShippingRegion())
                .note(order.getNote())
                .status(order.getStatus())
                .paymentMethod(order.getPaymentMethod())
                .paymentStatus(order.getPaymentStatus())
                .subtotalAmount(order.getSubtotalAmount())
                .discountCode(order.getDiscountCode())
                .discountAmount(order.getDiscountAmount())
                .finalAmount(order.getFinalAmount())
                .totalAmount(order.getTotalAmount())
                .cancelReason(order.getCancelReason())
                .cancelledAt(order.getCancelledAt())
                .createdAt(order.getCreatedAt())
                .items(order.getItems().stream().map(this::toItemResponse).toList())
                .build();
    }

    private AdminOrderItemResponse toItemResponse(OrderItem item) {
        Product product = item.getVariantSize().getVariant().getProduct();

        return AdminOrderItemResponse.builder()
                .productId(product.getId())
                .productName(product.getName())
                .color(item.getVariantSize().getVariant().getColor())
                .sizeValue(String.valueOf(item.getVariantSize().getSize().getValue()))
                .images(item.getVariantSize().getVariant().getImages().stream().map(this::toImageResponse).toList())
                .quantity(item.getQuantity())
                .originalPrice(product.getPrice() == null ? item.getPrice() : product.getPrice())
                .price(item.getPrice())
                .subTotal(item.getPrice() * item.getQuantity())
                .build();
    }

    private ProductImageResponse toImageResponse(ProductImage image) {
        ProductImageResponse response = new ProductImageResponse();
        response.setId(image.getId());
        response.setImageUrl(image.getImageUrl());
        response.setMain(image.isMain());
        return response;
    }
}
