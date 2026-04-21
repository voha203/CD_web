package com.sneaker.backend.dto.productsize;

import lombok.Data;

@Data
public class ProductSizeDTO {

    private Long id;
    private Integer size;
    private Integer quantity;
    private Long productId;
}