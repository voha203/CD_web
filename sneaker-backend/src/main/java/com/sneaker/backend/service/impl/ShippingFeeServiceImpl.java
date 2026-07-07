package com.sneaker.backend.service.impl;

import com.sneaker.backend.service.ShippingFeeService;
import org.springframework.stereotype.Service;

import java.text.Normalizer;
import java.util.Locale;

@Service
public class ShippingFeeServiceImpl implements ShippingFeeService {
    private static final double FREE_SHIPPING_THRESHOLD = 1_000_000D;
    private static final double HCM_FEE = 20_000D;
    private static final double OTHER_PROVINCE_FEE = 35_000D;

    @Override
    public double calculateFee(String provinceOrAddress, double subtotalAmount) {
        if (subtotalAmount >= FREE_SHIPPING_THRESHOLD) {
            return 0D;
        }
        return "HO_CHI_MINH".equals(resolveRegion(provinceOrAddress)) ? HCM_FEE : OTHER_PROVINCE_FEE;
    }

    @Override
    public String resolveRegion(String provinceOrAddress) {
        String normalized = normalize(provinceOrAddress);
        if (normalized.contains("ho chi minh")
                || normalized.contains("hcm")
                || normalized.contains("tp hcm")
                || normalized.contains("tphcm")
                || normalized.contains("sai gon")) {
            return "HO_CHI_MINH";
        }
        return "OTHER_PROVINCE";
    }

    private String normalize(String value) {
        if (value == null) return "";
        String noAccent = Normalizer.normalize(value, Normalizer.Form.NFD)
                .replaceAll("\\p{M}", "");
        return noAccent.toLowerCase(Locale.ROOT)
                .replace('.', ' ')
                .replace('-', ' ')
                .replaceAll("\\s+", " ")
                .trim();
    }
}
