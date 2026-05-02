package com.sneaker.backend.controller;

import com.sneaker.backend.dto.productVariant.ProductVariantDTO;
import com.sneaker.backend.service.ProductVariantService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/variants")
@CrossOrigin("*")
public class ProductVariantController {

    @Autowired
    private ProductVariantService productVariantService;

    @GetMapping("/product/{productId}")
    public List<ProductVariantDTO> getByProductId(@PathVariable Long productId) {
        return productVariantService.getByProductId(productId);
    }
}