package com.sneaker.backend.dto.admin;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class UpdateOrderStatusRequest {
    @NotBlank(message = "Trạng thái đơn hàng không được để trống")
    private String status;

    @Size(max = 255, message = "Lý do hủy không được vượt quá 255 ký tự")
    private String cancelReason;
}
