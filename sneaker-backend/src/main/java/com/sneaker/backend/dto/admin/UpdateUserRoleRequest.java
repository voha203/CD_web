package com.sneaker.backend.dto.admin;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import lombok.Data;

@Data
public class UpdateUserRoleRequest {
    @NotBlank(message = "Vai trò không được để trống")
    @Pattern(regexp = "^(USER|ADMIN)$", message = "Vai trò không hợp lệ")
    private String role;
}
