package com.sneaker.backend.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.Data;

@Entity
@Data
@Table(name = "product_sizes")
public class ProductSize {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Integer size;     // 38, 39, 40...

    private Integer quantity; // tồn kho theo size

    @ManyToOne
    @JoinColumn(name = "product_id")
    @JsonIgnore // tránh vòng lặp JSON
    private Product product;
}