package com.sneaker.backend.dto.admin;

import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class UpdateUserStatusRequest {
    @NotNull(message = "Trạng thái tài khoản không được để trống")
    private Boolean active;
}
