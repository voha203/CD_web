package com.sneaker.backend.dto.cart;

import com.sneaker.backend.dto.cartItem.CartItemDTO;
import lombok.Data;

import java.util.List;

@Data
public class CartDTO {
    private Long id;
    private List<CartItemDTO> items;
}