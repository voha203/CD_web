package com.sneaker.backend.service.impl;

import com.sneaker.backend.entity.Category;
import com.sneaker.backend.repository.CategoryRepository;
import com.sneaker.backend.service.CategoryService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class CategoryServiceImpl implements CategoryService {

    @Autowired
    private CategoryRepository categoryRepository;

    @Override
    public List<Category> getAll() {
        return categoryRepository.findAll().stream()
                .filter(category -> !Boolean.FALSE.equals(category.getActive()))
                .toList();
    }

    @Override
    public Category getById(Long id) {
        return categoryRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Category not found"));
    }

    @Override
    public Category create(Category category) {
        return categoryRepository.save(category);
    }

    @Override
    public Category update(Long id, Category newCategory) {
        Category c = getById(id);
        c.setName(newCategory.getName());
        c.setCode(newCategory.getCode());
        return categoryRepository.save(c);
    }

    @Override
    public void delete(Long id) {
        categoryRepository.deleteById(id);
    }
}
