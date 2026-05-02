package com.sneaker.backend.service;

import com.sneaker.backend.dto.productVariant.ProductVariantDTO;

import java.util.List;

public interface ProductVariantService {

    List<ProductVariantDTO> getByProductId(Long productId);

    ProductVariantDTO getById(Long id);

    ProductVariantDTO create(ProductVariantDTO dto);
}