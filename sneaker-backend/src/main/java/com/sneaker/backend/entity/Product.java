package com.sneaker.backend.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.Formula;

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

    // Lấy điểm trung bình trực tiếp từ bảng reviews
    @Formula("(SELECT COALESCE(AVG(r.rating), 0.0) FROM reviews r WHERE r.product_id = id)")
    private Double averageRating;

    // Đếm tổng số bình luận trực tiếp từ bảng reviews
    @Formula("(SELECT COUNT(r.id) FROM reviews r WHERE r.product_id = id)")
    private Integer reviewCount;
}