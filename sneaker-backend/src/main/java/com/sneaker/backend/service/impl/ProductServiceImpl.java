package com.sneaker.backend.service.impl;

import com.sneaker.backend.entity.Product;
import com.sneaker.backend.repository.ProductRepository;
import com.sneaker.backend.service.ProductService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ProductServiceImpl implements ProductService {

    @Autowired
    private ProductRepository productRepository;

    @Override
    public List<Product> getAll() {
        return productRepository.findAll();
    }

    @Override
    public Product getById(Long id) {
        return productRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Product not found"));
    }

    @Override
    public Product create(Product product) {
        return productRepository.save(product);
    }

    @Override
    public Product update(Long id, Product newProduct) {
        Product p = getById(id);

        p.setName(newProduct.getName());
        p.setPrice(newProduct.getPrice());
        p.setDescription(newProduct.getDescription());
        p.setImage(newProduct.getImage());
        p.setStock(newProduct.getStock());
        p.setCategoryId(newProduct.getCategoryId());

        return productRepository.save(p);
    }

    @Override
    public void delete(Long id) {
        productRepository.deleteById(id);
    }
}