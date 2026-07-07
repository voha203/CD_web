package com.sneaker.backend.service;

public interface ShippingFeeService {
    double calculateFee(String provinceOrAddress, double subtotalAmount);

    String resolveRegion(String provinceOrAddress);
}
