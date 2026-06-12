package com.sneaker.backend.service;

import com.sneaker.backend.dto.order.OrderDTO;
import com.sneaker.backend.dto.order.OrderRequest;

public interface OrderService {
    OrderDTO placeOrder(OrderRequest request);

    OrderDTO getOrderById(Long id);
}