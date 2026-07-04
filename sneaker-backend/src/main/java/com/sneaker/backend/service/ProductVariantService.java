package com.sneaker.backend.service;

import com.sneaker.backend.dto.productVariant.ProductVariantResponse;

import java.util.List;

public interface ProductVariantService {

    List<ProductVariantResponse> getByProductId(Long productId);

    ProductVariantResponse getById(Long id);

    ProductVariantResponse create(ProductVariantResponse dto);
}