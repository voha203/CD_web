package com.sneaker.backend.controller;

import com.sneaker.backend.dto.productsize.ProductSizeResponse;
import com.sneaker.backend.dto.productsize.ProductSizeRequest;
import com.sneaker.backend.entity.Product;
import com.sneaker.backend.entity.ProductSize;
import com.sneaker.backend.repository.ProductRepository;
import com.sneaker.backend.service.ProductSizeService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/product-sizes")
public class ProductSizeController {

    @Autowired
    private ProductSizeService productSizeService;

    @Autowired
    private ProductRepository productRepository;

    // GET size theo product
    @GetMapping("/product/{productId}")
    public List<ProductSizeResponse> getByProduct(@PathVariable Long productId) {
        return productSizeService.getByProduct(productId);
    }

    // CREATE size cho product
    @PostMapping
    public ProductSizeResponse create(@RequestBody ProductSizeRequest request) {

        Product product = productRepository.findById(request.getProductId())
                .orElseThrow(() -> new RuntimeException("Product not found"));

        ProductSize ps = new ProductSize();
        ps.setProduct(product);
        ps.setSize(request.getSize());
        ps.setQuantity(request.getQuantity());

        ProductSize saved = productSizeService.create(ps);

        ProductSizeResponse dto = new ProductSizeResponse();
        dto.setId(saved.getId());
        dto.setSize(saved.getSize());
        dto.setQuantity(saved.getQuantity());
        dto.setProductId(product.getId());

        return dto;
    }
}