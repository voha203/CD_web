package com.sneaker.backend.service;

import com.sneaker.backend.dto.product.ProductDTO;
import com.sneaker.backend.dto.product.ProductRequest;

import java.util.List;

public interface ProductService {

    List<ProductDTO> getAll(String sortBy, String sortDir);

    ProductDTO getById(Long id);

    ProductDTO create(ProductRequest request);

    ProductDTO update(Long id, ProductRequest request);

    void delete(Long id);
}