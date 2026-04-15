package com.sneaker.backend.controller;

import com.sneaker.backend.entity.Category;
import com.sneaker.backend.service.CategoryService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/categories")
@CrossOrigin("*")
public class CategoryController {

    @Autowired
    private CategoryService categoryService;

    // GET ALL
    @GetMapping
    public List<Category> getAll() {
        return categoryService.getAll();
    }

    // GET BY ID
    @GetMapping("/{id}")
    public Category getById(@PathVariable Long id) {
        return categoryService.getById(id);
    }

    // CREATE
    @PostMapping
    public Category create(@RequestBody Category category) {
        return categoryService.create(category);
    }

    // UPDATE
    @PutMapping("/{id}")
    public Category update(@PathVariable Long id, @RequestBody Category category) {
        return categoryService.update(id, category);
    }

    // DELETE
    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id) {
        categoryService.delete(id);
    }
}