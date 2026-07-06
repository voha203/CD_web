package com.sneaker.backend.controller;

import com.sneaker.backend.dto.cart.CartRequest;
import com.sneaker.backend.service.CartService;
import jakarta.validation.Valid;
import jakarta.validation.constraints.Min;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/cart")
@CrossOrigin("*")
@Validated
public class CartController {

    @Autowired
    private CartService cartService;

    @GetMapping
    public ResponseEntity<?> getMyCart() {
        return ResponseEntity.ok(cartService.getMyCart());
    }

    @DeleteMapping("/clear")
    public ResponseEntity<?> clearCart() {
        cartService.clearCart();
        return ResponseEntity.ok("Đã xóa toàn bộ giỏ hàng!");
    }

    @PostMapping("/add")
    public ResponseEntity<?> addToCart(@Valid @RequestBody CartRequest request) {
        cartService.addToCart(request);
        return ResponseEntity.ok("Đã thêm vào giỏ hàng thành công!");
    }

    @PutMapping("/{cartItemId}")
    public ResponseEntity<?> updateItemQuantity(
            @PathVariable Long cartItemId,
            @RequestParam @Min(value = 1, message = "Số lượng phải lớn hơn 0") int quantity) {
        cartService.updateQuantity(cartItemId, quantity);
        return ResponseEntity.ok("Đã cập nhật số lượng!");
    }

    @DeleteMapping("/{cartItemId}")
    public ResponseEntity<?> removeCartItem(@PathVariable Long cartItemId) {
        cartService.removeCartItem(cartItemId);
        return ResponseEntity.ok("Đã xóa sản phẩm khỏi giỏ!");
    }
}
