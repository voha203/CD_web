package com.sneaker.backend.dto.cart;

import lombok.Data;

@Data
public class CartRequest {
    private Long userId;

    private Long variantSizeId;

    private Integer quantity;
}