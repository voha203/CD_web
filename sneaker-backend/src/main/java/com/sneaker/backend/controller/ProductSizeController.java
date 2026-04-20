package com.sneaker.backend.controller;

import com.sneaker.backend.entity.Product;
import com.sneaker.backend.entity.ProductSize;
import com.sneaker.backend.repository.ProductRepository;
import com.sneaker.backend.service.ProductSizeService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/product-sizes")
@CrossOrigin("*")
public class ProductSizeController {

    @Autowired
    private ProductSizeService productSizeService;

    @Autowired
    private ProductRepository productRepository;

    // GET size theo product
    @GetMapping("/product/{productId}")
    public List<ProductSize> getByProduct(@PathVariable Long productId) {
        return productSizeService.getByProduct(productId);
    }

    // CREATE size cho product
    @PostMapping
    public ProductSize create(@RequestBody ProductSize productSize) {

        // đảm bảo product tồn tại
        Product product = productRepository.findById(productSize.getProduct().getId())
                .orElseThrow(() -> new RuntimeException("Product not found"));

        productSize.setProduct(product);

        return productSizeService.create(productSize);
    }
}