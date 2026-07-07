package com.sneaker.backend.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "product_images")
public class ProductImage {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "image_url", columnDefinition = "TEXT")
    private String imageUrl;

    @Column(name = "public_id")
    private String publicId;

    @Column(name = "is_main")
    private boolean isMain;

    @Column(name = "sort_order")
    private Integer sortOrder = 0;

    @ManyToOne
    @JoinColumn(name = "variant_id")
    @JsonIgnore
    private ProductVariant variant;
}
