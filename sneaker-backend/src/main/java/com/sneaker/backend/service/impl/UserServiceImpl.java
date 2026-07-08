package com.sneaker.backend.service.impl;

import com.sneaker.backend.entity.PasswordResetOtp;
import com.sneaker.backend.entity.User;
import com.sneaker.backend.repository.PasswordResetOtpRepository;
import com.sneaker.backend.repository.UserRepository;
import com.sneaker.backend.service.EmailService;
import com.sneaker.backend.service.UserService;
import com.sneaker.backend.dto.auth.ChangePasswordRequest;
import com.sneaker.backend.dto.auth.ForgotPasswordRequest;
import com.sneaker.backend.dto.auth.ResetPasswordRequest;
import com.sneaker.backend.dto.user.ProfileResponse;
import com.sneaker.backend.dto.user.UpdateProfileRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.time.LocalDateTime;
import java.util.Random;

@Service
public class UserServiceImpl implements UserService {

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private UserRepository userRepository;
    @Autowired
    private PasswordResetOtpRepository passwordResetOtpRepository;

    @Autowired
    private EmailService emailService;
    // REGISTER
    @Override
    public User register(User user) {

        if (userRepository.existsByUsername(user.getUsername())) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Username already exists");
        }

        if (userRepository.existsByEmail(user.getEmail())) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Email already exists");
        }

        if (user.getRole() == null) {
            user.setRole("USER");
        }

        // encode password
        user.setPassword(passwordEncoder.encode(user.getPassword()));

        return userRepository.save(user);
    }

    // LOGIN
    @Override
    public User login(String username, String password) {

        User user = findByUsernameEmailOrPhone(username)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.BAD_REQUEST, "User not found"));

        if (Boolean.FALSE.equals(user.getActive())) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Tài khoản đã bị khóa");
        }

        if (!passwordEncoder.matches(password, user.getPassword())) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Wrong password");
        }

        return user;
    }

    // FIND USER
    @Override
    public User findByUsername(String username) {
        return userRepository.findByUsername(username)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.BAD_REQUEST, "User not found"));
    }

    @Override
    public ProfileResponse getProfile(String username) {
        return toProfileResponse(findByUsername(username));
    }

    @Override
    public ProfileResponse updateProfile(String username, UpdateProfileRequest request) {
        User user = findByUsername(username);

        String email = normalizeNullable(request.getEmail());
        String phone = normalizeNullable(request.getPhone());

        if (email != null) {
            userRepository.findByEmail(email).ifPresent(existing -> {
                if (!existing.getId().equals(user.getId())) {
                    throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Email đã được sử dụng");
                }
            });
        }

        if (phone != null) {
            userRepository.findByPhone(phone).ifPresent(existing -> {
                if (!existing.getId().equals(user.getId())) {
                    throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Số điện thoại đã được sử dụng");
                }
            });
        }

        user.setFullName(normalizeNullable(request.getFullName()));
        user.setEmail(email);
        user.setPhone(phone);
        user.setAddress(normalizeNullable(request.getAddress()));
        user.setAvatarUrl(normalizeNullable(request.getAvatarUrl()));

        return toProfileResponse(userRepository.save(user));
    }

    private java.util.Optional<User> findByUsernameEmailOrPhone(String identifier) {
        return userRepository.findByUsername(identifier)
                .or(() -> userRepository.findByEmail(identifier))
                .or(() -> userRepository.findByPhone(identifier));
    }
    @Override
    public void changePassword(String username, ChangePasswordRequest request) {
        User user = findByUsername(username);

        if (!passwordEncoder.matches(request.getOldPassword(), user.getPassword())) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Mật khẩu cũ không đúng");
        }

        if (!request.getNewPassword().equals(request.getConfirmPassword())) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Mật khẩu xác nhận không khớp");
        }

        user.setPassword(passwordEncoder.encode(request.getNewPassword()));
        userRepository.save(user);
    }
    @Override
    public void sendForgotPasswordOtp(ForgotPasswordRequest request) {
        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.BAD_REQUEST, "Email không tồn tại trong hệ thống"));

        String otp = String.valueOf(100000 + new Random().nextInt(900000));

        PasswordResetOtp resetOtp = new PasswordResetOtp();
        resetOtp.setEmail(user.getEmail());
        resetOtp.setOtp(otp);
        resetOtp.setExpiredAt(LocalDateTime.now().plusMinutes(5));
        resetOtp.setUsed(false);

        passwordResetOtpRepository.save(resetOtp);

        emailService.sendOtpEmail(user.getEmail(), otp);
    }

    @Override
    public void resetPassword(ResetPasswordRequest request) {
        if (!request.getNewPassword().equals(request.getConfirmPassword())) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Mật khẩu xác nhận không khớp");
        }

        PasswordResetOtp resetOtp = passwordResetOtpRepository
                .findTopByEmailAndOtpAndUsedFalseOrderByIdDesc(
                        request.getEmail(),
                        request.getOtp()
                )
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.BAD_REQUEST, "OTP không đúng"));

        if (resetOtp.getExpiredAt().isBefore(LocalDateTime.now())) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "OTP đã hết hạn");
        }

        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.BAD_REQUEST, "Email không tồn tại"));

        user.setPassword(passwordEncoder.encode(request.getNewPassword()));
        userRepository.save(user);

        resetOtp.setUsed(true);
        passwordResetOtpRepository.save(resetOtp);
    }

    private ProfileResponse toProfileResponse(User user) {
        ProfileResponse response = new ProfileResponse();
        response.setId(user.getId());
        response.setUsername(user.getUsername());
        response.setEmail(user.getEmail());
        response.setFullName(user.getFullName());
        response.setPhone(user.getPhone());
        response.setAddress(user.getAddress());
        response.setAvatarUrl(user.getAvatarUrl());
        response.setRole(user.getRole());
        return response;
    }

    private String normalizeNullable(String value) {
        if (value == null) {
            return null;
        }

        String trimmed = value.trim();
        return trimmed.isEmpty() ? null : trimmed;
    }
}
