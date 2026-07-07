package com.sneaker.backend.dto.category;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class CategoryRequest {
    @NotBlank(message = "Tên danh mục không được để trống")
    @Size(max = 100, message = "Tên danh mục tối đa 100 ký tự")
    private String name;

    @NotBlank(message = "Mã danh mục không được để trống")
    @Pattern(regexp = "^[A-Z0-9_-]{2,30}$", message = "Mã danh mục chỉ gồm chữ hoa, số, gạch dưới hoặc gạch ngang")
    private String code;
}
