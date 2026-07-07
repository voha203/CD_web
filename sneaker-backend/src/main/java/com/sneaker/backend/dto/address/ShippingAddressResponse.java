package com.sneaker.backend.dto.address;

import lombok.Data;

import java.time.LocalDateTime;

@Data
public class ShippingAddressResponse {
    private Long id;
    private String receiverName;
    private String receiverPhone;
    private String province;
    private String district;
    private String ward;
    private String detailAddress;
    private String fullAddress;
    private Boolean isDefault;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
