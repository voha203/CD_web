package com.sneaker.backend.controller;

import com.sneaker.backend.dto.discount.DiscountRequest;
import com.sneaker.backend.dto.discount.DiscountResponse;
import com.sneaker.backend.service.DiscountService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin/discounts")
@CrossOrigin("*")
public class AdminDiscountController {

    @Autowired
    private DiscountService discountService;

    @GetMapping
    public List<DiscountResponse> getAll() {
        return discountService.getAll();
    }

    @GetMapping("/{id}")
    public DiscountResponse getById(@PathVariable Long id) {
        return discountService.getById(id);
    }

    @PostMapping
    public DiscountResponse create(@Valid @RequestBody DiscountRequest request) {
        return discountService.create(request);
    }

    @PutMapping("/{id}")
    public DiscountResponse update(@PathVariable Long id, @Valid @RequestBody DiscountRequest request) {
        return discountService.update(id, request);
    }

    @PatchMapping("/{id}/toggle")
    public DiscountResponse toggle(@PathVariable Long id) {
        return discountService.toggle(id);
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id) {
        discountService.delete(id);
    }
}
