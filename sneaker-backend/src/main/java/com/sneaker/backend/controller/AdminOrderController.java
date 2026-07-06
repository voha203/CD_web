package com.sneaker.backend.controller;

import com.sneaker.backend.dto.admin.UpdateOrderStatusRequest;
import com.sneaker.backend.dto.admin.UpdatePaymentStatusRequest;
import com.sneaker.backend.service.AdminOrderService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/admin/orders")
@CrossOrigin("*")
public class AdminOrderController {

    @Autowired
    private AdminOrderService orderService;

    @GetMapping
    public Object getOrders(
            @RequestParam(required = false) String status,
            @RequestParam(required = false) String paymentStatus,
            @RequestParam(required = false) String keyword) {
        return orderService.getOrders(status, paymentStatus, keyword);
    }

    @GetMapping("/{id}")
    public Object getOrderById(@PathVariable Long id) {
        return orderService.getOrderById(id);
    }

    @PatchMapping("/{id}/status")
    public Object updateStatus(
            @PathVariable Long id,
            @Valid @RequestBody UpdateOrderStatusRequest request) {
        return orderService.updateStatus(id, request);
    }

    @PatchMapping("/{id}/payment-status")
    public Object updatePaymentStatus(
            @PathVariable Long id,
            @Valid @RequestBody UpdatePaymentStatusRequest request) {
        return orderService.updatePaymentStatus(id, request);
    }

    @PatchMapping("/{id}/confirm-refund")
    public Object confirmRefund(@PathVariable Long id) {
        return orderService.confirmRefund(id);
    }
}
