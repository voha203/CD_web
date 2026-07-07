package com.sneaker.backend.dto.admin;

import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class UpdateActiveStatusRequest {
    @NotNull(message = "Trạng thái không được để trống")
    private Boolean active;
}
