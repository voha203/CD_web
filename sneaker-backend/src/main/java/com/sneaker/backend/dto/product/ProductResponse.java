package com.sneaker.backend.dto.product;

import com.sneaker.backend.dto.productVariant.ProductVariantResponse;
import lombok.Data;

import java.util.List;

@Data
public class ProductResponse {

    private Long id;
    private String name;
    private String brand;
    private Double price;
    private String description;
    private Long categoryId;
    private Boolean active;
    private Double finalPrice;
    private Boolean onSale;
    private Integer discountPercent;
    private String discountType;
    private Double discountValue;

    private Double averageRating;
    private Integer reviewCount;

    private List<ProductVariantResponse> variants;
}
