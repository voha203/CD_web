package com.sneaker.backend.service;

import com.sneaker.backend.dto.productImage.ProductImageDTO;
import com.sneaker.backend.entity.ProductImage;

import java.util.List;

public interface ProductImageService {
    List<ProductImageDTO> toDTOList(List<ProductImage> images);

    List<ProductImageDTO> getByVariantId(Long variantId);
}