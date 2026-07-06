package com.sneaker.backend.dto.admin;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class UpdatePaymentStatusRequest {
    @NotBlank(message = "Trạng thái thanh toán không được để trống")
    private String paymentStatus;
}
