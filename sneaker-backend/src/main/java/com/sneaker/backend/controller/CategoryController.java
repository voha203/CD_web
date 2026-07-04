package com.sneaker.backend.controller;

import com.sneaker.backend.dto.category.CategoryResponse;
import com.sneaker.backend.dto.category.CategoryRequest;
import com.sneaker.backend.entity.Category;
import com.sneaker.backend.service.CategoryService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/categories")
@CrossOrigin("*")
public class CategoryController {

    @Autowired
    private CategoryService categoryService;

    // 🔥 GET ALL
    @GetMapping
    public List<CategoryResponse> getAll() {
        return categoryService.getAll()
                .stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    // GET BY ID
    @GetMapping("/{id}")
    public CategoryResponse getById(@PathVariable Long id) {
        return toDTO(categoryService.getById(id));
    }

    // CREATE
    @PostMapping
    public CategoryResponse create(@RequestBody CategoryRequest request) {

        Category c = new Category();
        c.setName(request.getName());
        c.setCode(request.getCode());

        return toDTO(categoryService.create(c));
    }

    // UPDATE
    @PutMapping("/{id}")
    public CategoryResponse update(@PathVariable Long id,
                                   @RequestBody CategoryRequest request) {

        Category c = new Category();
        c.setName(request.getName());
        c.setCode(request.getCode());

        return toDTO(categoryService.update(id, c));
    }

    // DELETE
    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id) {
        categoryService.delete(id);
    }

    //convert Entity → DTO
    private CategoryResponse toDTO(Category c) {
        CategoryResponse dto = new CategoryResponse();
        dto.setId(c.getId());
        dto.setName(c.getName());
        dto.setCode(c.getCode());
        return dto;
    }
}