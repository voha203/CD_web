package com.sneaker.backend.controller;

import com.sneaker.backend.dto.product.ProductDTO;
import com.sneaker.backend.dto.product.ProductRequest;
import com.sneaker.backend.service.ProductService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/products")
@CrossOrigin("*")
public class ProductController {

    @Autowired
    private ProductService service;

    @GetMapping
    public List<ProductDTO> getAll(@RequestParam(defaultValue = "id") String sortBy,
                                   @RequestParam(defaultValue = "asc") String sortDir,
                                   @RequestParam(required = false) List<String> brands,
                                   @RequestParam(required = false) Double minPrice,
                                   @RequestParam(required = false) Double maxPrice,
                                   @RequestParam(required = false) Long categoryId,
                                   @RequestParam(required = false) List<Integer> sizes) {
        return service.getAll(sortBy, sortDir,  brands, minPrice, maxPrice, categoryId, sizes);
    }

    @GetMapping("/{id}")
    public ProductDTO getById(@PathVariable Long id) {
        return service.getById(id);
    }

    @PostMapping
    public ProductDTO create(@RequestBody ProductRequest request) {
        return service.create(request);
    }

    @PutMapping("/{id}")
    public ProductDTO update(@PathVariable Long id,
                             @RequestBody ProductRequest request) {
        return service.update(id, request);
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id) {
        service.delete(id);
    }
}