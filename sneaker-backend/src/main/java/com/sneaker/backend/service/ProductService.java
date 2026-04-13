package com.sneaker.backend.service;

import com.sneaker.backend.entity.Product;

import java.util.List;

public interface ProductService {
    List<Product> getAll();
}