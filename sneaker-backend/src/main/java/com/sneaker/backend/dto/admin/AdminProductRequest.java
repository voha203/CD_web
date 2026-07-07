package com.sneaker.backend.dto.admin;

import jakarta.validation.Valid;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import jakarta.validation.constraints.Size;
import lombok.Data;

import java.util.ArrayList;
import java.util.List;

@Data
public class AdminProductRequest {
    @NotBlank(message = "Tên sản phẩm không được để trống")
    @Size(max = 150, message = "Tên sản phẩm tối đa 150 ký tự")
    private String name;

    @NotBlank(message = "Thương hiệu không được để trống")
    @Size(max = 80, message = "Thương hiệu tối đa 80 ký tự")
    private String brand;

    @NotNull(message = "Giá sản phẩm không được để trống")
    @DecimalMin(value = "0.0", inclusive = false, message = "Giá sản phẩm phải lớn hơn 0")
    private Double price;

    @Size(max = 5000, message = "Mô tả tối đa 5000 ký tự")
    private String description;

    @NotNull(message = "Danh mục không được để trống")
    @Positive(message = "Danh mục không hợp lệ")
    private Long categoryId;

    private Boolean active = true;

    @Valid
    @NotEmpty(message = "Sản phẩm phải có ít nhất một biến thể")
    private List<AdminProductVariantRequest> variants = new ArrayList<>();
}
