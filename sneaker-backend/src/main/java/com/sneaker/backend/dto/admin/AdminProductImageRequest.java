package com.sneaker.backend.dto.admin;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class AdminProductImageRequest {
    private Long id;

    @NotBlank(message = "URL ảnh không được để trống")
    private String imageUrl;

    private String publicId;

    private Boolean main;

    private Integer sortOrder;
}
