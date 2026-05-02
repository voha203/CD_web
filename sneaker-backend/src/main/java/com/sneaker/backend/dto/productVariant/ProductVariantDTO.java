package com.sneaker.backend.dto.productVariant;

import com.sneaker.backend.dto.productImage.ProductImageDTO;
import com.sneaker.backend.dto.productVariantSize.ProductVariantSizeDTO;
import lombok.Data;

import java.util.List;

@Data
public class ProductVariantDTO {

    private Long id;
    private String color;
    private String sku;

    private List<ProductImageDTO> images;
    private List<ProductVariantSizeDTO> sizes;
}