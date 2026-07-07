package com.sneaker.backend.controller;

import com.sneaker.backend.dto.productsize.ProductSizeResponse;
import com.sneaker.backend.dto.productsize.ProductSizeRequest;
import com.sneaker.backend.service.ProductSizeService;

import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/product-sizes")
public class ProductSizeController {

    @Autowired
    private ProductSizeService productSizeService;

    // GET size theo product
    @GetMapping("/product/{productId}")
    public List<ProductSizeResponse> getByProduct(@PathVariable Long productId) {
        return productSizeService.getByProduct(productId);
    }

    // CREATE size cho product
    @PostMapping
    public ProductSizeResponse create(@Valid @RequestBody ProductSizeRequest request) {
        return productSizeService.create(request);
    }
}
