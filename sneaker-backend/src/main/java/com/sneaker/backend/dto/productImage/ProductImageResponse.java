package com.sneaker.backend.dto.productImage;

import lombok.Data;

@Data
public class ProductImageResponse {

    private Long id;
    private String imageUrl;
    private String publicId;
    private boolean isMain;
    private Integer sortOrder;
}
