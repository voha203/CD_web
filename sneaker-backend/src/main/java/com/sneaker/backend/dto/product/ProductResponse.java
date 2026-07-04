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
    private Double finalPrice;

    private Double averageRating;
    private Integer reviewCount;

    private List<ProductVariantResponse> variants;
}