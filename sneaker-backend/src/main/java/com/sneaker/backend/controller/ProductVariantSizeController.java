package com.sneaker.backend.controller;

import com.sneaker.backend.dto.productVariantSize.ProductVariantSizeDTO;
import com.sneaker.backend.service.ProductVariantSizeService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/variant-sizes")
@CrossOrigin("*")
public class ProductVariantSizeController {

    @Autowired
    private ProductVariantSizeService service;

    @GetMapping("/variant/{variantId}")
    public List<ProductVariantSizeDTO> getByVariant(@PathVariable Long variantId) {
        return service.getByVariantId(variantId);
    }
}