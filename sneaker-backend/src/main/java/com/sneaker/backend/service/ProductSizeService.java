package com.sneaker.backend.service;

import com.sneaker.backend.dto.productsize.ProductSizeDTO;
import com.sneaker.backend.entity.ProductSize;

import java.util.List;

public interface ProductSizeService {
    // Kiểu trả về PHẢI LÀ List<ProductSizeDTO> để khớp với ServiceImpl
    List<ProductSizeDTO> getByProduct(Long productId);

    ProductSize create(ProductSize productSize);
}