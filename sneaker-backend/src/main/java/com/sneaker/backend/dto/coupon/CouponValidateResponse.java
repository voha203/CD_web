package com.sneaker.backend.dto.coupon;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class CouponValidateResponse {
    private double subtotalAmount;
    private String couponCode;
    private double discountAmount;
    private double finalAmount;
    private String message;
}
