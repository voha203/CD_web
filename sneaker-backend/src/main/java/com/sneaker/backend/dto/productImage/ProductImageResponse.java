package com.sneaker.backend.dto.productImage;

import lombok.Data;

@Data
public class ProductImageResponse {

    private Long id;
    private String imageUrl;
    private boolean isMain;
}