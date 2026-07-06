package com.sneaker.backend.controller;

import com.sneaker.backend.dto.order.CancelOrderRequest;
import com.sneaker.backend.dto.order.OrderRequest;
import com.sneaker.backend.dto.order.OrderResponse;
import com.sneaker.backend.service.OrderService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/orders")
@CrossOrigin("*")
public class OrderController {

    @Autowired
    private OrderService orderService;

    @GetMapping
    public ResponseEntity<?> getMyOrders() {
        try {
            return ResponseEntity.ok(orderService.getMyOrders());
        } catch (ResponseStatusException e) {
            return ResponseEntity.status(e.getStatusCode()).body(e.getReason());
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body("Could not load orders: " + e.getMessage());
        }
    }

    @PostMapping("/checkout")
    public ResponseEntity<?> checkout(@Valid @RequestBody OrderRequest request, BindingResult bindingResult) {
        try {
            if (bindingResult.hasErrors()) {
                return ResponseEntity.badRequest().body(bindingResult.getFieldErrors().stream()
                        .map(error -> error.getDefaultMessage())
                        .collect(Collectors.joining(", ")));
            }

            OrderResponse result = orderService.placeOrder(request);
            return ResponseEntity.ok(result);
        } catch (ResponseStatusException e) {
            return ResponseEntity.status(e.getStatusCode()).body(e.getReason());
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body("Error: " + e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body("System error: " + e.getMessage());
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getOrderById(@PathVariable Long id) {
        try {
            return ResponseEntity.ok(orderService.getOrderById(id));
        } catch (ResponseStatusException e) {
            return ResponseEntity.status(e.getStatusCode()).body(e.getReason());
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body("Order not found: " + e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body("Could not load order: " + e.getMessage());
        }
    }

    @PostMapping("/{id}/cancel")
    public ResponseEntity<?> cancelOrder(
            @PathVariable Long id,
            @Valid @RequestBody CancelOrderRequest request,
            BindingResult bindingResult) {
        try {
            if (bindingResult.hasErrors()) {
                return ResponseEntity.badRequest().body(bindingResult.getFieldErrors().stream()
                        .map(error -> error.getDefaultMessage())
                        .collect(Collectors.joining(", ")));
            }

            return ResponseEntity.ok(orderService.cancelOrder(id, request.getReason()));
        } catch (ResponseStatusException e) {
            return ResponseEntity.status(e.getStatusCode()).body(e.getReason());
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body("Could not cancel order: " + e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body("System error: " + e.getMessage());
        }
    }
}
