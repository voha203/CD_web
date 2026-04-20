package com.sneaker.backend.service.impl;

import com.sneaker.backend.entity.Product;
import com.sneaker.backend.entity.ProductSize;
import com.sneaker.backend.repository.ProductRepository;
import com.sneaker.backend.repository.ProductSizeRepository;
import com.sneaker.backend.service.ProductSizeService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ProductSizeServiceImpl implements ProductSizeService {

    @Autowired
    private ProductSizeRepository productSizeRepository;

    @Autowired
    private ProductRepository productRepository;

    @Override
    public List<ProductSize> getByProduct(Long productId) {
        return productSizeRepository.findByProductId(productId);
    }

    @Override
    public ProductSize create(ProductSize productSize) {
        return productSizeRepository.save(productSize);
    }
}