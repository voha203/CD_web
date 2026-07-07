package com.sneaker.backend.service;

import com.sneaker.backend.dto.admin.AdminCategoryRequest;
import com.sneaker.backend.dto.admin.AdminCategoryResponse;
import com.sneaker.backend.dto.admin.AdminProductRequest;
import com.sneaker.backend.dto.admin.AdminProductResponse;

import java.util.List;

public interface AdminProductService {
    List<AdminProductResponse> getProducts(String keyword, String filter);

    AdminProductResponse getProductById(Long id);

    AdminProductResponse createProduct(AdminProductRequest request);

    AdminProductResponse updateProduct(Long id, AdminProductRequest request);

    AdminProductResponse updateProductStatus(Long id, Boolean active);

    List<AdminCategoryResponse> getCategories(String keyword);

    AdminCategoryResponse createCategory(AdminCategoryRequest request);

    AdminCategoryResponse updateCategory(Long id, AdminCategoryRequest request);

    AdminCategoryResponse updateCategoryStatus(Long id, Boolean active);
}
