package com.sneaker.backend.dto.productsize;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import jakarta.validation.constraints.PositiveOrZero;
import lombok.Data;

@Data
public class ProductSizeRequest {

    @NotNull(message = "Sản phẩm không được để trống")
    @Positive(message = "Sản phẩm không hợp lệ")
    private Long productId;

    @NotNull(message = "Size không được để trống")
    @Min(value = 30, message = "Size tối thiểu là 30")
    @Max(value = 50, message = "Size tối đa là 50")
    private Integer size;

    @NotNull(message = "Số lượng không được để trống")
    @PositiveOrZero(message = "Số lượng không được âm")
    private Integer quantity;
}
