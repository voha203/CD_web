package com.sneaker.backend.controller;

import com.sneaker.backend.dto.cart.CartRequest;
import com.sneaker.backend.service.CartService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/cart")
@CrossOrigin("*")
public class CartController {

    @Autowired
    private CartService cartService;

    // Lấy toàn bộ thông tin giỏ hàng của User
    @GetMapping
    public ResponseEntity<?> getMyCart() {
        try {
            return ResponseEntity.ok(cartService.getMyCart());
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Lỗi: " + e.getMessage());
        }
    }

    // Xóa sạch giỏ hàng
    @DeleteMapping("/clear")
    public ResponseEntity<?> clearCart() {
        try {
            cartService.clearCart();
            return ResponseEntity.ok("Đã xóa toàn bộ giỏ hàng!");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Lỗi: " + e.getMessage());
        }
    }

    // Thêm một món vào giỏ
    @PostMapping
    public ResponseEntity<?> addToCart(@RequestBody CartRequest request) {
        try {
            cartService.addToCart(request);
            return ResponseEntity.ok("Đã thêm vào giỏ hàng thành công!");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Lỗi: " + e.getMessage());
        }
    }

    // Cập nhật số lượng của 1 món hàng
    @PutMapping("/{cartItemId}")
    public ResponseEntity<?> updateItemQuantity(
            @PathVariable Long cartItemId,
            @RequestParam int quantity) {
        try {
            cartService.updateQuantity(cartItemId, quantity);
            return ResponseEntity.ok("Đã cập nhật số lượng!");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Lỗi: " + e.getMessage());
        }
    }

    // Xóa 1 món hàng
    @DeleteMapping("/{cartItemId}")
    public ResponseEntity<?> removeCartItem(@PathVariable Long cartItemId) {
        try {
            cartService.removeCartItem(cartItemId);
            return ResponseEntity.ok("Đã xóa sản phẩm khỏi giỏ!");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Lỗi: " + e.getMessage());
        }
    }
}