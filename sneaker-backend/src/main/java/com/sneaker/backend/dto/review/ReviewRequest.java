package com.sneaker.backend.dto.review;

import lombok.Data;

@Data
public class ReviewRequest {
    private Integer rating;  // Số sao (1-5)
    private String comment;  // Nội dung chữ
}