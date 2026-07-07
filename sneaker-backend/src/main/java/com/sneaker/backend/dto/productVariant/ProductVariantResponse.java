package com.sneaker.backend.dto.productVariant;

import com.sneaker.backend.dto.productImage.ProductImageResponse;
import com.sneaker.backend.dto.productVariantSize.ProductVariantSizeResponse;
import lombok.Data;

import java.util.List;

@Data
public class ProductVariantResponse {

    private Long id;
    private String color;
    private String sku;
    private Boolean active;

    private List<ProductImageResponse> images;
    private List<ProductVariantSizeResponse> sizes;
}
