package com.sneaker.backend.service;

import com.sneaker.backend.dto.productVariantSize.ProductVariantSizeDTO;

import java.util.List;

public interface ProductVariantSizeService {

    List<ProductVariantSizeDTO> getByVariantId(Long variantId);
}