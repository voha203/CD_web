package com.sneaker.backend.dto.auth;

import lombok.Data;

@Data
public class ForgotPasswordRequest {
    private String email;
}