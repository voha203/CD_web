package com.sneaker.backend.service;

import com.sneaker.backend.entity.Order;

public interface EmailService {
    void sendOtpEmail(String toEmail, String otp);

    void sendOrderPlacedEmail(Order order);

    void sendPaymentSuccessEmail(Order order);

    void sendOrderCancelledEmail(Order order);
}
