package com.sneaker.backend.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;
import java.util.List;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "products")
public class Product {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;
    private String brand;
    private Double price;

    @Column(columnDefinition = "TEXT")
    private String description;

    @ManyToOne
    @JoinColumn(name = "category_id")
    private Category category;

    private LocalDateTime createdAt = LocalDateTime.now();

    // cascade
    @OneToMany(mappedBy = "product",
            cascade = CascadeType.ALL,
            orphanRemoval = true)
    private List<ProductSize> productSizes;

    @OneToMany(mappedBy = "product", cascade = CascadeType.ALL, fetch = FetchType.EAGER)
    private List<ProductVariant> variants;

    // Điểm đánh giá trung bình (Ví dụ: 4.5) - Mặc định khi mới tạo là 0.0
    @Column(name = "average_rating", columnDefinition = "DOUBLE DEFAULT 0.0")
    private Double averageRating = 0.0;

    // Tổng số lượt đánh giá - Mặc định khi mới tạo là 0
    @Column(name = "review_count", columnDefinition = "INT DEFAULT 0")
    private Integer reviewCount = 0;
}