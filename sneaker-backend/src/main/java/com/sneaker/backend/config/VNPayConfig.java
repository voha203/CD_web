package com.sneaker.backend.config;

public class VNPayConfig {

    public static final String vnp_PayUrl = "https://sandbox.vnpayment.vn/paymentv2/vpcpay.html";
    public static final String vnp_ReturnUrl = "http://localhost:8080/api/payment/vnpay-return";
    public static final String vnp_TmnCode = "9167AHPW";
    public static final String secretKey = "W0J74OSMOX5EAMUT14R0VGOMXY3FXQZG";

    private VNPayConfig() {
    }
}
