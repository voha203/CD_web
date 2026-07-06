package com.sneaker.backend.service;

public interface EmailService {
    void sendOtpEmail(String toEmail, String otp);
}