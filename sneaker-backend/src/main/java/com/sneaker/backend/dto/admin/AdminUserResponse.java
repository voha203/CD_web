package com.sneaker.backend.dto.admin;

import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@Builder
public class AdminUserResponse {
    private Long id;
    private String username;
    private String email;
    private String fullName;
    private String phone;
    private String address;
    private String avatarUrl;
    private String role;
    private Boolean active;
    private LocalDateTime createdAt;
}
