package com.sneaker.backend.controller;

import com.sneaker.backend.dto.admin.UpdateUserRoleRequest;
import com.sneaker.backend.dto.admin.UpdateUserStatusRequest;
import com.sneaker.backend.service.AdminUserService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.security.Principal;

@RestController
@RequestMapping("/api/admin/users")
@CrossOrigin("*")
public class AdminUserController {

    @Autowired
    private AdminUserService userService;

    @GetMapping
    public Object getUsers(
            @RequestParam(required = false) String keyword,
            @RequestParam(required = false) String role,
            @RequestParam(required = false) Boolean active) {
        return userService.getUsers(keyword, role, active);
    }

    @GetMapping("/{id}")
    public Object getUserById(@PathVariable Long id) {
        return userService.getUserById(id);
    }

    @PatchMapping("/{id}/status")
    public Object updateStatus(
            @PathVariable Long id,
            @Valid @RequestBody UpdateUserStatusRequest request,
            Principal principal) {
        return userService.updateStatus(id, request.getActive(), principal.getName());
    }

    @PatchMapping("/{id}/role")
    public Object updateRole(
            @PathVariable Long id,
            @Valid @RequestBody UpdateUserRoleRequest request,
            Principal principal) {
        return userService.updateRole(id, request.getRole(), principal.getName());
    }
}
