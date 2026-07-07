package com.sneaker.backend.controller;

import com.sneaker.backend.dto.admin.AdminCategoryRequest;
import com.sneaker.backend.dto.admin.AdminProductRequest;
import com.sneaker.backend.dto.admin.UpdateActiveStatusRequest;
import com.sneaker.backend.service.AdminProductService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/admin")
@CrossOrigin("*")
public class AdminProductController {

    @Autowired
    private AdminProductService productService;

    @GetMapping("/products")
    public Object getProducts(
            @RequestParam(required = false) String keyword,
            @RequestParam(required = false) String filter) {
        return productService.getProducts(keyword, filter);
    }

    @GetMapping("/products/{id}")
    public Object getProductById(@PathVariable Long id) {
        return productService.getProductById(id);
    }

    @PostMapping("/products")
    public Object createProduct(@Valid @RequestBody AdminProductRequest request) {
        return productService.createProduct(request);
    }

    @PutMapping("/products/{id}")
    public Object updateProduct(@PathVariable Long id, @Valid @RequestBody AdminProductRequest request) {
        return productService.updateProduct(id, request);
    }

    @PatchMapping("/products/{id}/status")
    public Object updateProductStatus(@PathVariable Long id, @Valid @RequestBody UpdateActiveStatusRequest request) {
        return productService.updateProductStatus(id, request.getActive());
    }

    @GetMapping("/categories")
    public Object getCategories(@RequestParam(required = false) String keyword) {
        return productService.getCategories(keyword);
    }

    @PostMapping("/categories")
    public Object createCategory(@Valid @RequestBody AdminCategoryRequest request) {
        return productService.createCategory(request);
    }

    @PutMapping("/categories/{id}")
    public Object updateCategory(@PathVariable Long id, @Valid @RequestBody AdminCategoryRequest request) {
        return productService.updateCategory(id, request);
    }

    @PatchMapping("/categories/{id}/status")
    public Object updateCategoryStatus(@PathVariable Long id, @Valid @RequestBody UpdateActiveStatusRequest request) {
        return productService.updateCategoryStatus(id, request.getActive());
    }
}
