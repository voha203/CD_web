package com.sneaker.backend.controller;

import com.sneaker.backend.service.PaymentService;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.view.RedirectView;

import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/payment")
public class PaymentController {

    @Autowired
    private PaymentService paymentService;

    @GetMapping("/create-url")
    public ResponseEntity<?> createPaymentUrl(
            @RequestParam Long orderId,
            @RequestParam(required = false) String bankCode,
            HttpServletRequest request) {
        String paymentUrl = paymentService.createVNPayOrder(orderId, bankCode, request);

        return ResponseEntity.ok(Map.of("paymentUrl", paymentUrl));
    }

    @GetMapping("/vnpay-return")
    public RedirectView vnpayReturn(HttpServletRequest request) {
        Optional<Long> paidOrderId = paymentService.processReturn(request);

        return paidOrderId
                .map(orderId -> new RedirectView("http://localhost:5173/thank-you?orderId=" + orderId))
                .orElseGet(() -> new RedirectView("http://localhost:5173/payment-failed"));
    }

    @GetMapping("/vnpay-ipn")
    public ResponseEntity<?> vnpayIpn(HttpServletRequest request) {
        try {
            // Gọi Service để xử lý logic kiểm tra chữ ký, số tiền và cập nhật trạng thái
            Map<String, String> response = paymentService.processIpn(request);

            return ResponseEntity.ok(response);

        } catch (Exception e) {
            // Nếu có lỗi hệ thống đột xuất
            return ResponseEntity.ok(Map.of(
                    "RspCode", "99",
                    "Message", "Unknown error"
            ));
        }
    }
}
