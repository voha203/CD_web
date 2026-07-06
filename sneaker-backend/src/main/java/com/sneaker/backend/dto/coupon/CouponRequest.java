package com.sneaker.backend.dto.coupon;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.Data;

import java.time.LocalDateTime;

@Data
public class CouponRequest {
    @NotBlank(message = "Mã giảm giá không được để trống")
    @Pattern(regexp = "^[A-Z0-9_-]{2,50}$", message = "Mã giảm giá chỉ gồm chữ hoa, số, gạch dưới hoặc gạch ngang")
    private String code;

    @NotBlank(message = "Tên mã giảm giá không được để trống")
    @Size(max = 120, message = "Tên mã giảm giá tối đa 120 ký tự")
    private String name;

    @Size(max = 500, message = "Mô tả tối đa 500 ký tự")
    private String description;

    @NotBlank(message = "Loại giảm giá không được để trống")
    @Pattern(regexp = "^(PERCENT|FIXED)$", message = "Loại giảm giá phải là PERCENT hoặc FIXED")
    private String discountType;

    @NotNull(message = "Giá trị giảm không được để trống")
    @DecimalMin(value = "0.0", inclusive = false, message = "Giá trị giảm phải lớn hơn 0")
    private Double discountValue;

    @DecimalMin(value = "0.0", message = "Đơn tối thiểu không được âm")
    private Double minOrderAmount;

    @DecimalMin(value = "0.0", inclusive = false, message = "Mức giảm tối đa phải lớn hơn 0")
    private Double maxDiscountAmount;

    private LocalDateTime startDate;
    private LocalDateTime endDate;

    @DecimalMin(value = "1", message = "Giới hạn lượt dùng phải lớn hơn 0")
    private Integer usageLimit;

    private Boolean active;
}
