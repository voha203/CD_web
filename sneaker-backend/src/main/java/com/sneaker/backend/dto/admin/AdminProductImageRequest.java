package com.sneaker.backend.dto.admin;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Positive;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class AdminProductImageRequest {
    @Positive(message = "Ảnh sản phẩm không hợp lệ")
    private Long id;

    @NotBlank(message = "URL ảnh không được để trống")
    @Size(max = 2000, message = "URL ảnh tối đa 2000 ký tự")
    private String imageUrl;

    @Size(max = 255, message = "Public ID tối đa 255 ký tự")
    private String publicId;

    private Boolean main;

    @Min(value = 0, message = "Thứ tự ảnh không được âm")
    private Integer sortOrder;
}
