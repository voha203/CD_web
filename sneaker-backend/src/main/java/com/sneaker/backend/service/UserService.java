package com.sneaker.backend.service;

import com.sneaker.backend.entity.User;
import com.sneaker.backend.dto.auth.ChangePasswordRequest;
import com.sneaker.backend.dto.auth.ForgotPasswordRequest;
import com.sneaker.backend.dto.auth.ResetPasswordRequest;
public interface UserService {

    User register(User user);

    User login(String username, String password);
    User findByUsername(String username);
    void changePassword(String username, ChangePasswordRequest request);
    void sendForgotPasswordOtp(ForgotPasswordRequest request);
    void resetPassword(ResetPasswordRequest request);
}