package com.sneaker.backend.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@Entity
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "product_variants")
public class ProductVariant {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String color;

    @Column(unique = true)
    private String sku;

    private Boolean active = true;

    @ManyToOne
    @JoinColumn(name = "product_id")
    @JsonIgnore
    private Product product;

    @OneToMany(mappedBy = "variant", cascade = CascadeType.ALL, fetch = FetchType.EAGER)
    private List<ProductImage> images;

    @OneToMany(mappedBy = "variant", cascade = CascadeType.ALL)
    private List<ProductVariantSize> sizes;
}
