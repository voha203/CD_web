package com.sneaker.backend.config;

public class VNPayConfig {

    public static final String vnp_PayUrl = "https://sandbox.vnpayment.vn/paymentv2/vpcpay.html";
    public static final String vnp_ReturnUrl = "http://localhost:8080/api/payment/vnpay-return";
    public static final String vnp_TmnCode = "CHANGE_ME";
    public static final String secretKey = "CHANGE_ME";

    private VNPayConfig() {
    }
}
