package com.sneaker.backend.dto.auth;

import com.sneaker.backend.dto.user.UserDTO;
import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class AuthResponse {
    private UserDTO user;
    private String token;
}