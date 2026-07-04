package com.sneaker.backend.dto.productsize;

import lombok.Data;

@Data
public class ProductSizeResponse {

    private Long id;
    private Integer size;
    private Integer quantity;
    private Long productId;
}