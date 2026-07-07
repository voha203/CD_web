package com.sneaker.backend.service;

import com.sneaker.backend.dto.admin.AdminUserResponse;

import java.util.List;

public interface AdminUserService {
    List<AdminUserResponse> getUsers(String keyword, String role, Boolean active);

    AdminUserResponse getUserById(Long id);

    AdminUserResponse updateStatus(Long id, Boolean active, String currentUsername);

    AdminUserResponse updateRole(Long id, String role, String currentUsername);
}
