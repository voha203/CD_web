package com.sneaker.backend.dto.order;

import com.sneaker.backend.dto.orderItem.OrderItemDTO;
import lombok.Data;

import java.time.LocalDateTime;
import java.util.List;

@Data
public class OrderDTO {
    private Long orderId;
    private String status;
    private double totalAmount;
    private LocalDateTime createdAt;
    private String receiverName;
    private String receiverPhone;
    private String shippingAddress;
    private List<OrderItemDTO> items;
}