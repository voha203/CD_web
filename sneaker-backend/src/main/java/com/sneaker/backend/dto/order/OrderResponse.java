package com.sneaker.backend.dto.order;

import com.sneaker.backend.dto.orderItem.OrderItemResponse;
import lombok.Data;

import java.time.LocalDateTime;
import java.util.List;

@Data
public class OrderResponse {
    private Long orderId;
    private String status;
    private String paymentStatus;
    private double totalAmount;
    private LocalDateTime createdAt;
    private LocalDateTime cancelledAt;
    private String receiverName;
    private String receiverPhone;
    private String shippingAddress;
    private Long shippingAddressId;
    private double shippingFee;
    private String shippingRegion;
    private List<OrderItemResponse> items;
    private String paymentMethod;
    private String cancelReason;
    private double subtotalAmount;
    private String discountCode;
    private double discountAmount;
    private double finalAmount;
}
