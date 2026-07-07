package com.sneaker.backend.service;

import com.sneaker.backend.entity.User;
import com.sneaker.backend.dto.auth.ChangePasswordRequest;
import com.sneaker.backend.dto.auth.ForgotPasswordRequest;
import com.sneaker.backend.dto.auth.ResetPasswordRequest;
import com.sneaker.backend.dto.user.ProfileResponse;
import com.sneaker.backend.dto.user.UpdateProfileRequest;

public interface UserService {

    User register(User user);

    User login(String username, String password);
    User findByUsername(String username);
    ProfileResponse getProfile(String username);
    ProfileResponse updateProfile(String username, UpdateProfileRequest request);
    void changePassword(String username, ChangePasswordRequest request);
    void sendForgotPasswordOtp(ForgotPasswordRequest request);
    void resetPassword(ResetPasswordRequest request);
}
