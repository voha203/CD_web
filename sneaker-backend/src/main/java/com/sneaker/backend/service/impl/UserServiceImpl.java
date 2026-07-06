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
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

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
            throw new RuntimeException("Username already exists");
        }

        if (userRepository.existsByEmail(user.getEmail())) {
            throw new RuntimeException("Email already exists");
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
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (!passwordEncoder.matches(password, user.getPassword())) {
            throw new RuntimeException("Wrong password");
        }

        return user;
    }

    // FIND USER
    @Override
    public User findByUsername(String username) {
        return userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));
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
            throw new RuntimeException("Mật khẩu cũ không đúng");
        }

        if (!request.getNewPassword().equals(request.getConfirmPassword())) {
            throw new RuntimeException("Mật khẩu xác nhận không khớp");
        }

        user.setPassword(passwordEncoder.encode(request.getNewPassword()));
        userRepository.save(user);
    }
    @Override
    public void sendForgotPasswordOtp(ForgotPasswordRequest request) {
        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new RuntimeException("Email không tồn tại trong hệ thống"));

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
            throw new RuntimeException("Mật khẩu xác nhận không khớp");
        }

        PasswordResetOtp resetOtp = passwordResetOtpRepository
                .findTopByEmailAndOtpAndUsedFalseOrderByIdDesc(
                        request.getEmail(),
                        request.getOtp()
                )
                .orElseThrow(() -> new RuntimeException("OTP không đúng"));

        if (resetOtp.getExpiredAt().isBefore(LocalDateTime.now())) {
            throw new RuntimeException("OTP đã hết hạn");
        }

        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new RuntimeException("Email không tồn tại"));

        user.setPassword(passwordEncoder.encode(request.getNewPassword()));
        userRepository.save(user);

        resetOtp.setUsed(true);
        passwordResetOtpRepository.save(resetOtp);
    }
}
