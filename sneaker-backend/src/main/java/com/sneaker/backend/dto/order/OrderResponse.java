package com.sneaker.backend.dto.order;

import com.sneaker.backend.dto.orderItem.OrderItemResponse;
import lombok.Data;

import java.time.LocalDateTime;
import java.util.List;

@Data
public class OrderResponse {
    private Long orderId;
    private String status;
    private double totalAmount;
    private LocalDateTime createdAt;
    private String receiverName;
    private String receiverPhone;
    private String shippingAddress;
    private List<OrderItemResponse> items;
    private String paymentMethod;
}