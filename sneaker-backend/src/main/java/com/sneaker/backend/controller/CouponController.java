package com.sneaker.backend.controller;

import com.sneaker.backend.dto.coupon.CouponValidateRequest;
import com.sneaker.backend.dto.coupon.CouponValidateResponse;
import com.sneaker.backend.service.CouponService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/coupons")
public class CouponController {

    @Autowired
    private CouponService couponService;

    @PostMapping("/validate")
    public ResponseEntity<CouponValidateResponse> validate(@Valid @RequestBody CouponValidateRequest request) {
        return ResponseEntity.ok(couponService.validateCurrentUserCart(request.getCouponCode()));
    }
}
