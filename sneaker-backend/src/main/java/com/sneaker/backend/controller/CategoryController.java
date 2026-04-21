package com.sneaker.backend.controller;

import com.sneaker.backend.dto.category.CategoryDTO;
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
    public List<CategoryDTO> getAll() {
        return categoryService.getAll()
                .stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    // GET BY ID
    @GetMapping("/{id}")
    public CategoryDTO getById(@PathVariable Long id) {
        return toDTO(categoryService.getById(id));
    }

    // CREATE
    @PostMapping
    public CategoryDTO create(@RequestBody CategoryRequest request) {

        Category c = new Category();
        c.setName(request.getName());
        c.setDescription(request.getDescription());

        return toDTO(categoryService.create(c));
    }

    // UPDATE
    @PutMapping("/{id}")
    public CategoryDTO update(@PathVariable Long id,
                              @RequestBody CategoryRequest request) {

        Category c = new Category();
        c.setName(request.getName());
        c.setDescription(request.getDescription());

        return toDTO(categoryService.update(id, c));
    }

    // DELETE
    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id) {
        categoryService.delete(id);
    }

    //convert Entity → DTO
    private CategoryDTO toDTO(Category c) {
        CategoryDTO dto = new CategoryDTO();
        dto.setId(c.getId());
        dto.setName(c.getName());
        dto.setDescription(c.getDescription());
        return dto;
    }
}