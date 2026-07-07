package com.sneaker.backend.entity;

import jakarta.persistence.*;
import lombok.Data;

import java.time.LocalDateTime;

@Entity
@Data
@Table(name = "coupons")
public class Coupon {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String code;

    private String name;
    private String description;

    private String discountType; // PERCENT, FIXED

    private double discountValue;
    private double minOrderAmount;
    private Double maxDiscountAmount;

    private LocalDateTime startDate;
    private LocalDateTime endDate;

    private Integer usageLimit;
    private int usedCount = 0;

    private boolean active = true;

    private LocalDateTime createdAt;

    @PrePersist
    protected void onCreate() {
        this.createdAt = LocalDateTime.now();
        normalizeCode();
    }

    @PreUpdate
    protected void onUpdate() {
        normalizeCode();
    }

    private void normalizeCode() {
        if (this.code != null) {
            this.code = this.code.trim().toUpperCase();
        }
    }
}
