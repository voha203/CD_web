package com.sneaker.backend.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "product_variant_sizes")
public class ProductVariantSize {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    private ProductVariant variant;

    @ManyToOne
    @JoinColumn(name = "size_id")
    private Size size;

    private Integer quantity;
}