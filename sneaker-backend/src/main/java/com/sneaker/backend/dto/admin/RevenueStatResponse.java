package com.sneaker.backend.dto.admin;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class RevenueStatResponse {
    private String label;
    private double revenue;
    private long orders;
}
