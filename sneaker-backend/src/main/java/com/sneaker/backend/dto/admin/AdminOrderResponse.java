package com.sneaker.backend.dto.admin;

import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;
import java.util.List;

@Data
@Builder
public class AdminOrderResponse {
    private Long orderId;
    private Long userId;
    private String username;
    private String fullName;
    private String email;
    private String phone;
    private String receiverName;
    private String receiverPhone;
    private String shippingAddress;
    private Long shippingAddressId;
    private double shippingFee;
    private String shippingRegion;
    private String note;
    private String status;
    private String paymentMethod;
    private String paymentStatus;
    private double subtotalAmount;
    private String discountCode;
    private double discountAmount;
    private double finalAmount;
    private double totalAmount;
    private String cancelReason;
    private LocalDateTime cancelledAt;
    private LocalDateTime createdAt;
    private List<AdminOrderItemResponse> items;
}
