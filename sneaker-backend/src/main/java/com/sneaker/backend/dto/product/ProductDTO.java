package com.sneaker.backend.dto.product;

import lombok.Data;

@Data
public class ProductDTO {

    private Long id;
    private String name;
    private Double price;
    private String description;
    private String image;
    private Integer stock;
    private Long categoryId;
}