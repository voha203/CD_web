package com.sneaker.backend.dto.coupon;

import lombok.Data;

import java.time.LocalDateTime;

@Data
public class CouponResponse {
    private Long id;
    private String code;
    private String name;
    private String description;
    private String discountType;
    private double discountValue;
    private double minOrderAmount;
    private Double maxDiscountAmount;
    private LocalDateTime startDate;
    private LocalDateTime endDate;
    private Integer usageLimit;
    private int usedCount;
    private boolean active;
    private LocalDateTime createdAt;
}
