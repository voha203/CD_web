package com.sneaker.backend.controller;

import com.sneaker.backend.dto.discount.*;
import com.sneaker.backend.entity.Discount;
import com.sneaker.backend.entity.Product;
import com.sneaker.backend.service.DiscountService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/discounts")
@CrossOrigin("*")
public class DiscountController {

    @Autowired
    private DiscountService discountService;

    // GET ALL
    @GetMapping
    public List<DiscountDTO> getAll() {
        return discountService.getAll()
                .stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    // CREATE
    @PostMapping
    public DiscountDTO create(@RequestBody DiscountRequest request) {

        // check productId
        if (request.getProductId() == null) {
            throw new RuntimeException("ProductId is required");
        }

        // validate type
        if (!"PERCENT".equalsIgnoreCase(request.getType()) &&
                !"FIXED".equalsIgnoreCase(request.getType())) {
            throw new RuntimeException("Invalid discount type (PERCENT / FIXED)");
        }

        Discount d = new Discount();
        d.setName(request.getName());
        d.setType(request.getType());
        d.setValue(request.getValue());
        d.setStartDate(request.getStartDate());
        d.setEndDate(request.getEndDate());
        d.setActive(request.getActive());

        Product p = new Product();
        p.setId(request.getProductId());
        d.setProduct(p);

        return toDTO(discountService.create(d));
    }

    // GET BY PRODUCT
    @GetMapping("/product/{id}")
    public List<DiscountDTO> getByProduct(@PathVariable Long id) {
        return discountService.getByProduct(id)
                .stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }
    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id) {
        discountService.delete(id);
    }
    // NULL POINTER
    private DiscountDTO toDTO(Discount d) {
        DiscountDTO dto = new DiscountDTO();

        dto.setId(d.getId());
        dto.setName(d.getName());
        dto.setType(d.getType());
        dto.setValue(d.getValue());
        dto.setStartDate(d.getStartDate());
        dto.setEndDate(d.getEndDate());
        dto.setActive(d.getActive());

        if (d.getProduct() != null) {
            dto.setProductId(d.getProduct().getId());
        }

        return dto;
    }
}