package com.sneaker.backend.service;

import jakarta.servlet.http.HttpServletRequest;

import java.util.Map;

public interface PaymentService {
    String createVNPayOrder(Long orderId, String bankCode, HttpServletRequest request);

    Map<String, String> processIpn(HttpServletRequest request);
}