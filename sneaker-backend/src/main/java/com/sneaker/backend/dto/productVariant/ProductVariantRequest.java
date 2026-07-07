package com.sneaker.backend.dto.productVariant;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Positive;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class ProductVariantRequest {
    @Positive(message = "Biến thể không hợp lệ")
    private Long id;

    @Size(max = 80, message = "SKU tối đa 80 ký tự")
    private String sku;

    @NotBlank(message = "Màu sắc không được để trống")
    @Size(max = 80, message = "Màu sắc tối đa 80 ký tự")
    private String color;

    @DecimalMin(value = "0.0", inclusive = false, message = "Giá biến thể phải lớn hơn 0")
    private Double price;
}
