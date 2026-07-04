package com.sneaker.backend.service;

import com.sneaker.backend.dto.productVariantSize.ProductVariantSizeResponse;

import java.util.List;

public interface ProductVariantSizeService {

    List<ProductVariantSizeResponse> getByVariantId(Long variantId);
}