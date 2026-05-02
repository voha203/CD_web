package com.sneaker.backend.controller;

import com.sneaker.backend.dto.productImage.ProductImageDTO;
import com.sneaker.backend.service.ProductImageService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/images")
@CrossOrigin("*")
public class ProductImageController {

    @Autowired
    private ProductImageService productImageService;

    @GetMapping("/variant/{variantId}")
    public List<ProductImageDTO> getByVariantId(@PathVariable Long variantId) {
        return productImageService.getByVariantId(variantId);
    }
}