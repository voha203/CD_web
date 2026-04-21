package com.sneaker.backend.entity;

import jakarta.persistence.*;
import lombok.Data;

import java.time.LocalDateTime;

@Entity
@Data
@Table(name = "discounts")
public class Discount {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;

    // PERCENT hoặc FIXED
    private String type;

    private Double value;

    private LocalDateTime startDate;
    private LocalDateTime endDate;

    private Boolean active;

    // gắn với product
    @ManyToOne
    @JoinColumn(name = "product_id")
    private Product product;
}