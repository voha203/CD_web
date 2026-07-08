package com.sneaker.backend.dto.admin;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.Data;

@Data
public class AdminVariantSizeRequest {
    @Positive(message = "Dòng size không hợp lệ")
    private Long id;

    @NotNull(message = "Size không được để trống")
    @Positive(message = "Size không hợp lệ")
    private Long sizeId;

    @Min(value = 0, message = "Tồn kho không được âm")
    private Integer quantity;
}
