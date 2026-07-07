package com.sneaker.backend.dto.admin;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Positive;
import jakarta.validation.constraints.Size;
import lombok.Data;

import java.util.ArrayList;
import java.util.List;

@Data
public class AdminProductVariantRequest {
    @Positive(message = "Biến thể không hợp lệ")
    private Long id;

    @NotBlank(message = "Màu sắc không được để trống")
    @Size(max = 80, message = "Màu sắc tối đa 80 ký tự")
    private String color;

    @Size(max = 80, message = "SKU tối đa 80 ký tự")
    private String sku;
    private Boolean active = true;

    @Valid
    private List<AdminVariantSizeRequest> sizes = new ArrayList<>();

    @Valid
    private List<AdminProductImageRequest> images = new ArrayList<>();
}
