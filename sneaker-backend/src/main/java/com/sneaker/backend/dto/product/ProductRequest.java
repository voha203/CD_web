package com.sneaker.backend.dto.product;

import lombok.Data;

@Data
public class ProductRequest {

    private String name;
    private String brand;
    private Double price;
    private String description;
    private Long categoryId;
}