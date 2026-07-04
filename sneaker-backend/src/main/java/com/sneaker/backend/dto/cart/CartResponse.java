package com.sneaker.backend.dto.cart;

import com.sneaker.backend.dto.cartItem.CartItemResponse;
import lombok.Data;

import java.util.List;

@Data
public class CartResponse {
    private Long id;
    private List<CartItemResponse> items;
    private Long totalPrice;
}