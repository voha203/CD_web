package com.sneaker.backend.dto.admin;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class AdminVariantSizeRequest {
    private Long id;

    @NotNull(message = "Size không được để trống")
    private Long sizeId;

    @Min(value = 0, message = "Tồn kho không được âm")
    private Integer quantity;
}
