package com.sneaker.backend.dto.admin;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;

import java.util.ArrayList;
import java.util.List;

@Data
public class AdminProductVariantRequest {
    private Long id;

    @NotBlank(message = "Màu sắc không được để trống")
    private String color;

    private String sku;
    private Boolean active = true;

    @Valid
    private List<AdminVariantSizeRequest> sizes = new ArrayList<>();

    @Valid
    private List<AdminProductImageRequest> images = new ArrayList<>();
}
