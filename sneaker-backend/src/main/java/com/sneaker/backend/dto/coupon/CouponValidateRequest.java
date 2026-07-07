package com.sneaker.backend.dto.coupon;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class CouponValidateRequest {
    @NotBlank(message = "Mã giảm giá không được để trống")
    @Size(max = 50, message = "Mã giảm giá tối đa 50 ký tự")
    private String couponCode;
}
