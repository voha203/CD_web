package com.sneaker.backend.controller;

import com.sneaker.backend.entity.Order;
import com.sneaker.backend.repository.OrderRepository;
import com.sneaker.backend.service.PaymentService;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.view.RedirectView;

import java.util.Map;

@RestController
@RequestMapping("/api/payment")
@CrossOrigin("*")
public class PaymentController {

    @Autowired
    private PaymentService paymentService;

    @Autowired
    private OrderRepository orderRepository;

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
        String responseCode = request.getParameter("vnp_ResponseCode");

        String vnp_TxnRef = request.getParameter("vnp_TxnRef");
        String orderId = vnp_TxnRef.split("_")[0];

        if ("00".equals(responseCode)) {
            Order order = orderRepository.findById(Long.parseLong(orderId)).orElseThrow();

            order.setPaymentStatus("PAID");
            order.setStatus("PENDING");

            orderRepository.save(order);

            return new RedirectView("http://localhost:5173/thank-you?orderId=" + orderId);
        }

        return new RedirectView("http://localhost:5173/payment-failed");
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
