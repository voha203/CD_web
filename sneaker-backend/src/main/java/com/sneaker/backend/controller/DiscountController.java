package com.sneaker.backend.controller;

import com.sneaker.backend.dto.discount.DiscountResponse;
import com.sneaker.backend.service.DiscountService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/discounts")
@CrossOrigin("*")
public class DiscountController {

    @Autowired
    private DiscountService discountService;

    @GetMapping
    public List<DiscountResponse> getAll() {
        return discountService.getAll();
    }

    @GetMapping("/active")
    public List<DiscountResponse> getActive() {
        return discountService.getActive();
    }

    @GetMapping("/product/{id}")
    public List<DiscountResponse> getByProduct(@PathVariable Long id) {
        return discountService.getByProduct(id);
    }
}
