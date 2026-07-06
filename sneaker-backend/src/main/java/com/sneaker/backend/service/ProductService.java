package com.sneaker.backend.service;

import com.sneaker.backend.dto.product.ProductResponse;
import com.sneaker.backend.dto.product.ProductRequest;

import java.util.List;

public interface ProductService {

    List<ProductResponse> getAll(String sortBy, String sortDir, List<String> brands, Double minPrice, Double maxPrice, Long categoryId, List<Integer> sizes, String keyword);

    List<ProductResponse> getSuggestions(String keyword);

    List<ProductResponse> getRecommendations(Long orderId);

    List<ProductResponse> getSaleProducts();

    ProductResponse getById(Long id);

    ProductResponse create(ProductRequest request);

    ProductResponse update(Long id, ProductRequest request);

    void delete(Long id);
}
