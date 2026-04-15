package com.sneaker.backend.controller;

import com.sneaker.backend.entity.User;
import com.sneaker.backend.security.JwtUtil;
import com.sneaker.backend.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

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
    public User register(@RequestBody User user) {
        return userService.register(user);
    }

    // LOGIN
    @PostMapping("/login")
    public Map<String, Object> login(@RequestBody User user) {

        User u = userService.login(user.getUsername(), user.getPassword());

        String token = jwtUtil.generateToken(u.getUsername());
        u.setPassword(null); // chú ý dòng này để ẩn pass
        Map<String, Object> response = new HashMap<>();
        response.put("user", u);
        response.put("token", token);

        return response;
    }
}