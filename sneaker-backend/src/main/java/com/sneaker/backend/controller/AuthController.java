package com.sneaker.backend.controller;

import com.sneaker.backend.dto.auth.*;
import com.sneaker.backend.dto.user.ProfileResponse;
import com.sneaker.backend.dto.user.UpdateProfileRequest;
import com.sneaker.backend.dto.user.UserResponse;
import com.sneaker.backend.entity.User;
import com.sneaker.backend.security.JwtUtil;
import com.sneaker.backend.service.UserService;

import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin("*")
public class AuthController {

    @Autowired
    private UserService userService;

    @Autowired
    private JwtUtil jwtUtil;

    // REGISTER
    @PostMapping("/register")
    public UserResponse register(@Valid @RequestBody RegisterRequest request) {

        User user = new User();
        user.setUsername(request.getUsername());
        user.setPassword(request.getPassword());
        user.setEmail(request.getEmail());
        user.setFullName(request.getFullName());
        user.setPhone(request.getPhone());
        user.setAddress(request.getAddress());

        User savedUser = userService.register(user);

        return toDTO(savedUser);
    }

    // LOGIN
    @PostMapping("/login")
    public AuthResponse login(@Valid @RequestBody LoginRequest request) {

        User user = userService.login(
                request.getUsername(),
                request.getPassword()
        );

        String token = jwtUtil.generateToken(user.getUsername());

        return new AuthResponse(toDTO(user), token);
    }

    // PROFILE
    @GetMapping("/profile")
    public ResponseEntity<ProfileResponse> getUserProfile(Principal principal) {
        return ResponseEntity.ok(userService.getProfile(principal.getName()));
    }

    @PutMapping("/profile")
    public ResponseEntity<ProfileResponse> updateUserProfile(
            Principal principal,
            @Valid @RequestBody UpdateProfileRequest request
    ) {
        return ResponseEntity.ok(userService.updateProfile(principal.getName(), request));
    }

    // convert User → DTO (RẤT QUAN TRỌNG)
    private UserResponse toDTO(User u) {
        UserResponse dto = new UserResponse();
        dto.setId(u.getId());
        dto.setUsername(u.getUsername());
        dto.setEmail(u.getEmail());
        dto.setFullName(u.getFullName());
        dto.setPhone(u.getPhone());
        dto.setAddress(u.getAddress());
        dto.setAvatarUrl(u.getAvatarUrl());
        dto.setRole(u.getRole());
        return dto;
    }
    @PutMapping("/change-password")
    public ResponseEntity<?> changePassword(
            Principal principal,
            @Valid @RequestBody ChangePasswordRequest request
    ) {
        userService.changePassword(principal.getName(), request);
        return ResponseEntity.ok("Đổi mật khẩu thành công");
    }

    @PostMapping("/forgot-password")
    public ResponseEntity<?> forgotPassword(@Valid @RequestBody ForgotPasswordRequest request) {
        userService.sendForgotPasswordOtp(request);
        return ResponseEntity.ok("OTP đã được gửi về email");
    }

    @PostMapping("/reset-password")
    public ResponseEntity<?> resetPassword(@Valid @RequestBody ResetPasswordRequest request) {
        userService.resetPassword(request);
        return ResponseEntity.ok("Đặt lại mật khẩu thành công");
    }
}
