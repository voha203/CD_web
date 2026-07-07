package com.sneaker.backend.service;

import jakarta.servlet.http.HttpServletRequest;

import java.util.Map;
import java.util.Optional;

public interface PaymentService {
    String createVNPayOrder(Long orderId, String bankCode, HttpServletRequest request);

    Optional<Long> processReturn(HttpServletRequest request);

    Map<String, String> processIpn(HttpServletRequest request);
}
