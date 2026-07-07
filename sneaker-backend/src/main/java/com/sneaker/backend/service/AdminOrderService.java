package com.sneaker.backend.service;

import com.sneaker.backend.dto.admin.AdminOrderResponse;
import com.sneaker.backend.dto.admin.UpdateOrderStatusRequest;
import com.sneaker.backend.dto.admin.UpdatePaymentStatusRequest;

import java.util.List;

public interface AdminOrderService {
    List<AdminOrderResponse> getOrders(String status, String paymentStatus, String keyword);

    AdminOrderResponse getOrderById(Long id);

    AdminOrderResponse updateStatus(Long id, UpdateOrderStatusRequest request);

    AdminOrderResponse updatePaymentStatus(Long id, UpdatePaymentStatusRequest request);

    AdminOrderResponse confirmRefund(Long id);
}
