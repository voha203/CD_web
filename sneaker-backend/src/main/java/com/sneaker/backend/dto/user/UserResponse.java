package com.sneaker.backend.dto.user;

import lombok.Data;

@Data
public class UserResponse {

    private Long id;
    private String username;
    private String email;
    private String fullName;
    private String phone;
    private String address;
    private String role;
}