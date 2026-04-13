package com.sneaker.backend.service.impl;

import com.sneaker.backend.entity.Product;
import com.sneaker.backend.repository.ProductRepository;
import com.sneaker.backend.service.ProductService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ProductServiceImpl implements ProductService {

    private final ProductRepository repo;

    public List<Product> getAll() {
        return repo.findAll();
    }
}