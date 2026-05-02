package com.sneaker.backend.dto.productVariantSize;

import lombok.Data;

@Data
public class ProductVariantSizeDTO {

    private Long id;
    private Long variantId;
    private Long sizeId;

    private Integer sizeValue;
    private Integer quantity;
}