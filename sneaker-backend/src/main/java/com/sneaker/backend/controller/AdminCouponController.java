package com.sneaker.backend.controller;

import com.sneaker.backend.dto.coupon.CouponRequest;
import com.sneaker.backend.dto.coupon.CouponResponse;
import com.sneaker.backend.service.CouponService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin/coupons")
@CrossOrigin("*")
public class AdminCouponController {

    @Autowired
    private CouponService couponService;

    @GetMapping
    public List<CouponResponse> getAll() {
        return couponService.getAll();
    }

    @GetMapping("/{id}")
    public CouponResponse getById(@PathVariable Long id) {
        return couponService.getById(id);
    }

    @PostMapping
    public CouponResponse create(@Valid @RequestBody CouponRequest request) {
        return couponService.create(request);
    }

    @PutMapping("/{id}")
    public CouponResponse update(@PathVariable Long id, @Valid @RequestBody CouponRequest request) {
        return couponService.update(id, request);
    }

    @PatchMapping("/{id}/toggle")
    public CouponResponse toggle(@PathVariable Long id) {
        return couponService.toggle(id);
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id) {
        couponService.delete(id);
    }
}
