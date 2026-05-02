package com.sneaker.backend.dto.productImage;

import lombok.Data;

@Data
public class ProductImageDTO {

    private Long id;
    private String imageUrl;
    private boolean isMain;
}