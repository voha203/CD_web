package com.sneaker.backend.service;

import com.sneaker.backend.entity.ProductSize;

import java.util.List;

public interface ProductSizeService {

    List<ProductSize> getByProduct(Long productId);

    ProductSize create(ProductSize productSize);
}