package com.sneaker.backend.controller;

import com.sneaker.backend.dto.auth.*;
import com.sneaker.backend.dto.user.UserDTO;
import com.sneaker.backend.entity.User;
import com.sneaker.backend.security.JwtUtil;
import com.sneaker.backend.service.UserService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

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
    public UserDTO register(@RequestBody RegisterRequest request) {

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
    public AuthResponse login(@RequestBody LoginRequest request) {

        User user = userService.login(
                request.getUsername(),
                request.getPassword()
        );

        String token = jwtUtil.generateToken(user.getUsername());

        return new AuthResponse(toDTO(user), token);
    }

    // convert User → DTO (RẤT QUAN TRỌNG)
    private UserDTO toDTO(User u) {
        UserDTO dto = new UserDTO();
        dto.setId(u.getId());
        dto.setUsername(u.getUsername());
        dto.setEmail(u.getEmail());
        dto.setFullName(u.getFullName());
        dto.setPhone(u.getPhone());
        dto.setAddress(u.getAddress());
        dto.setRole(u.getRole());
        return dto;
    }
}