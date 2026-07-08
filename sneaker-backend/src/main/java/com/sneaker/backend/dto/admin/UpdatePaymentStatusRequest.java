package com.sneaker.backend.dto.admin;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import lombok.Data;

@Data
public class UpdatePaymentStatusRequest {
    @NotBlank(message = "Trạng thái thanh toán không được để trống")
    @Pattern(regexp = "^(UNPAID|PAID|COD_PENDING|FAILED|REFUND_PENDING|REFUNDED)$", message = "Trạng thái thanh toán không hợp lệ")
    private String paymentStatus;
}
