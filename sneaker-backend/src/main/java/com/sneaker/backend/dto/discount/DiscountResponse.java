package com.sneaker.backend.dto.discount;

import lombok.Data;

import java.time.LocalDateTime;

@Data
public class DiscountResponse {

    private Long id;
    private String name;
    private String type;
    private Double value;
    private LocalDateTime startDate;
    private LocalDateTime endDate;
    private Boolean active;
    private Long productId;
    private String productName;
    private Double originalPrice;
    private Double finalPrice;
    private Integer discountPercent;

}
