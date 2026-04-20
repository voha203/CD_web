package com.sneaker.backend.dto.productsize;

import lombok.Data;

@Data
public class ProductSizeRequest {

    private Long productId;
    private Integer size;
    private Integer quantity;
}