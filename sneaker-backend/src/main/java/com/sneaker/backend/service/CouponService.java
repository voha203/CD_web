package com.sneaker.backend.service;

import com.sneaker.backend.dto.coupon.CouponCalculation;
import com.sneaker.backend.dto.coupon.CouponRequest;
import com.sneaker.backend.dto.coupon.CouponResponse;
import com.sneaker.backend.dto.coupon.CouponValidateResponse;
import com.sneaker.backend.entity.Cart;

import java.util.List;

public interface CouponService {
    CouponCalculation calculate(Cart cart, String couponCode);

    CouponValidateResponse validateCurrentUserCart(String couponCode);

    void markCouponUsed(String couponCode);

    void releaseCouponUsage(String couponCode);

    List<CouponResponse> getAll();

    CouponResponse getById(Long id);

    CouponResponse create(CouponRequest request);

    CouponResponse update(Long id, CouponRequest request);

    CouponResponse toggle(Long id);

    void delete(Long id);
}
