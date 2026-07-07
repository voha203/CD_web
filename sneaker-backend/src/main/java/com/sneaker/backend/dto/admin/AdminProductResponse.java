package com.sneaker.backend.dto.admin;

import com.sneaker.backend.dto.productVariant.ProductVariantResponse;
import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;
import java.util.List;

@Data
@Builder
public class AdminProductResponse {
    private Long id;
    private String name;
    private String brand;
    private Double price;
    private Double finalPrice;
    private Boolean onSale;
    private Integer discountPercent;
    private String description;
    private Long categoryId;
    private String categoryName;
    private Boolean active;
    private Integer totalStock;
    private Boolean outOfStock;
    private LocalDateTime createdAt;
    private List<ProductVariantResponse> variants;
}
