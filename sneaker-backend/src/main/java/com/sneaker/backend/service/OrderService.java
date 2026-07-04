package com.sneaker.backend.service;

import com.sneaker.backend.dto.order.OrderResponse;
import com.sneaker.backend.dto.order.OrderRequest;

public interface OrderService {
    OrderResponse placeOrder(OrderRequest request);

    OrderResponse getOrderById(Long id);
}