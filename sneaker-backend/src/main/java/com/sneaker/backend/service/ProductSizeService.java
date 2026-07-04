package com.sneaker.backend.service;

import com.sneaker.backend.dto.productsize.ProductSizeResponse;
import com.sneaker.backend.entity.ProductSize;

import java.util.List;

public interface ProductSizeService {
    // Kiểu trả về PHẢI LÀ List<ProductSizeDTO> để khớp với ServiceImpl
    List<ProductSizeResponse> getByProduct(Long productId);

    ProductSize create(ProductSize productSize);
}