package com.sneaker.backend.dto.discount;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Positive;
import jakarta.validation.constraints.Size;
import lombok.Data;

import java.time.LocalDateTime;

@Data
public class DiscountRequest {

    @NotBlank(message = "Tên khuyến mãi không được để trống")
    @Size(max = 120, message = "Tên khuyến mãi tối đa 120 ký tự")
    private String name;

    @NotBlank(message = "Loại khuyến mãi không được để trống")
    @Pattern(regexp = "^(PERCENT|FIXED)$", message = "Loại khuyến mãi không hợp lệ")
    private String type;

    @NotNull(message = "Giá trị khuyến mãi không được để trống")
    @DecimalMin(value = "0.0", inclusive = false, message = "Giá trị khuyến mãi phải lớn hơn 0")
    private Double value;

    @NotNull(message = "Ngày bắt đầu không được để trống")
    private LocalDateTime startDate;

    @NotNull(message = "Ngày kết thúc không được để trống")
    private LocalDateTime endDate;

    private Boolean active;

    @NotNull(message = "Sản phẩm áp dụng không được để trống")
    @Positive(message = "Sản phẩm áp dụng không hợp lệ")
    private Long productId;
}
