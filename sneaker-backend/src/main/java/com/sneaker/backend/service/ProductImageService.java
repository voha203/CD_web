package com.sneaker.backend.service;

import com.sneaker.backend.dto.productImage.ProductImageResponse;
import com.sneaker.backend.entity.ProductImage;

import java.util.List;

public interface ProductImageService {
    List<ProductImageResponse> toDTOList(List<ProductImage> images);

    List<ProductImageResponse> getByVariantId(Long variantId);
}