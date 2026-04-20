package com.sneaker.backend.service.impl;

import com.sneaker.backend.dto.product.ProductDTO;
import com.sneaker.backend.dto.product.ProductRequest;
import com.sneaker.backend.entity.Product;
import com.sneaker.backend.entity.Category;
import com.sneaker.backend.repository.ProductRepository;
import com.sneaker.backend.repository.CategoryRepository;
import com.sneaker.backend.service.ProductService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class ProductServiceImpl implements ProductService {

    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private CategoryRepository categoryRepository;

    //  convert Entity → DTO
    private ProductDTO toDTO(Product p) {
        ProductDTO dto = new ProductDTO();
        dto.setId(p.getId());
        dto.setName(p.getName());
        dto.setPrice(p.getPrice());
        dto.setDescription(p.getDescription());
        dto.setImage(p.getImage());
        dto.setStock(p.getStock());
        dto.setCategoryId(p.getCategory().getId());
        return dto;
    }

    //  get all
    @Override
    public List<ProductDTO> getAll() {
        return productRepository.findAll()
                .stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    //  get by id
    @Override
    public ProductDTO getById(Long id) {
        Product p = productRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Product not found"));
        return toDTO(p);
    }

    //  create
    @Override
    public ProductDTO create(ProductRequest request) {

        Category category = categoryRepository.findById(request.getCategoryId())
                .orElseThrow(() -> new RuntimeException("Category not found"));

        Product p = new Product();
        p.setName(request.getName());
        p.setPrice(request.getPrice());
        p.setDescription(request.getDescription());
        p.setImage(request.getImage());
        p.setStock(request.getStock());
        p.setCategory(category);

        return toDTO(productRepository.save(p));
    }

    //  update
    @Override
    public ProductDTO update(Long id, ProductRequest request) {

        Product p = productRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Product not found"));

        Category category = categoryRepository.findById(request.getCategoryId())
                .orElseThrow(() -> new RuntimeException("Category not found"));

        p.setName(request.getName());
        p.setPrice(request.getPrice());
        p.setDescription(request.getDescription());
        p.setImage(request.getImage());
        p.setStock(request.getStock());
        p.setCategory(category);

        return toDTO(productRepository.save(p));
    }

    //  delete
    @Override
    public void delete(Long id) {
        productRepository.deleteById(id);
    }
}