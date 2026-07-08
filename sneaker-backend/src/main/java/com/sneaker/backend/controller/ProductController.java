package com.sneaker.backend.controller;

import com.sneaker.backend.dto.common.PageResponse;
import com.sneaker.backend.dto.product.ProductResponse;
import com.sneaker.backend.dto.product.ProductRequest;
import com.sneaker.backend.service.ProductService;

import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/products")
public class ProductController {

    @Autowired
    private ProductService service;

    @GetMapping
    public PageResponse<ProductResponse> getAll(@RequestParam(defaultValue = "0") int page,
                                        @RequestParam(defaultValue = "12") int size,
                                        @RequestParam(defaultValue = "id") String sortBy,
                                        @RequestParam(defaultValue = "asc") String sortDir,
                                        @RequestParam(required = false) List<String> brands,
                                        @RequestParam(required = false) Double minPrice,
                                        @RequestParam(required = false) Double maxPrice,
                                        @RequestParam(required = false) Long categoryId,
                                        @RequestParam(required = false) List<Integer> sizes,
                                        @RequestParam(required = false) String keyword) {
        return service.getAll(page, size, sortBy, sortDir,  brands, minPrice, maxPrice, categoryId, sizes, keyword);
    }

    @GetMapping("/suggestions")
    public List<ProductResponse> getSuggestions(@RequestParam(required = false) String keyword) {
        return service.getSuggestions(keyword);
    }

    @GetMapping("/recommendations")
    public List<ProductResponse> getRecommendations(@RequestParam Long orderId) {
        return service.getRecommendations(orderId);
    }

    @GetMapping("/sale")
    public List<ProductResponse> getSaleProducts() {
        return service.getSaleProducts();
    }

    @GetMapping("/{id}")
    public ProductResponse getById(@PathVariable Long id) {
        return service.getById(id);
    }

    @PostMapping
    public ProductResponse create(@Valid @RequestBody ProductRequest request) {
        return service.create(request);
    }

    @PutMapping("/{id}")
    public ProductResponse update(@PathVariable Long id,
                                  @Valid @RequestBody ProductRequest request) {
        return service.update(id, request);
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id) {
        service.delete(id);
    }
}
