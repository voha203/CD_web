package com.sneaker.backend.dto.order;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class CancelOrderRequest {
    @NotBlank(message = "Lý do hủy đơn không được để trống")
    @Size(max = 500, message = "Lý do hủy đơn tối đa 500 ký tự")
    private String reason;
}
