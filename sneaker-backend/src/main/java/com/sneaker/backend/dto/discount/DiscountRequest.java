package com.sneaker.backend.dto.discount;

import lombok.Data;

import java.time.LocalDateTime;

@Data
public class DiscountRequest {

    private String name;
    private String type;
    private Double value;
    private LocalDateTime startDate;
    private LocalDateTime endDate;
    private Boolean active;
    private Long productId;
}