package com.sneaker.backend.service;

import com.sneaker.backend.dto.cart.CartDTO;
import com.sneaker.backend.dto.cart.CartRequest;

public interface CartService {
    CartDTO getMyCart();
    void addToCart(CartRequest request);
    void updateQuantity(Long cartItemId, int quantity);
    void removeCartItem(Long cartItemId);
    void clearCart();
}