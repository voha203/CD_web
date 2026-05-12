package com.sneaker.backend.dto.order;

import lombok.Data;

@Data
public class OrderRequest {
    private Long userId;
    private String receiverName;
    private String receiverPhone;
    private String shippingAddress;
    private String paymentMethod;
    private String note;
}