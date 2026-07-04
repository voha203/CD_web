package com.sneaker.backend.dto.auth;

import com.sneaker.backend.dto.user.UserResponse;
import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class AuthResponse {
    private UserResponse user;
    private String token;
}