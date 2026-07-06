package com.sneaker.backend.controller;

import com.sneaker.backend.dto.order.CancelOrderRequest;
import com.sneaker.backend.dto.order.OrderRequest;
import com.sneaker.backend.dto.order.OrderResponse;
import com.sneaker.backend.service.OrderService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/orders")
@CrossOrigin("*")
public class OrderController {

    @Autowired
    private OrderService orderService;

    @GetMapping
    public ResponseEntity<?> getMyOrders() {
        return ResponseEntity.ok(orderService.getMyOrders());
    }

    @PostMapping("/checkout")
    public ResponseEntity<?> checkout(@Valid @RequestBody OrderRequest request) {
        OrderResponse result = orderService.placeOrder(request);
        return ResponseEntity.ok(result);
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getOrderById(@PathVariable Long id) {
        return ResponseEntity.ok(orderService.getOrderById(id));
    }

    @PostMapping("/{id}/cancel")
    public ResponseEntity<?> cancelOrder(
            @PathVariable Long id,
            @Valid @RequestBody CancelOrderRequest request) {
        return ResponseEntity.ok(orderService.cancelOrder(id, request.getReason()));
    }
}
