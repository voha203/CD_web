package com.sneaker.backend.controller;

import com.sneaker.backend.dto.order.OrderDTO;
import com.sneaker.backend.dto.order.OrderRequest;
import com.sneaker.backend.service.OrderService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/orders")
@CrossOrigin("*")
public class OrderController {

    @Autowired
    private OrderService orderService;

    @PostMapping("/checkout")
    public ResponseEntity<?> checkout(@RequestBody OrderRequest request) {
        try {
            OrderDTO result = orderService.placeOrder(request);
            return ResponseEntity.ok(result);
        } catch (RuntimeException e) {
            // Trả về HTTP 400 Bad Request nếu lỗi tồn kho hoặc giỏ hàng rỗng
            return ResponseEntity.badRequest().body("Lỗi: " + e.getMessage());
        } catch (Exception e) {
            // Trả về HTTP 500 nếu lỗi server bất ngờ
            return ResponseEntity.internalServerError().body("Lỗi hệ thống: " + e.getMessage());
        }
    }
}