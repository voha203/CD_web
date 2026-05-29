package com.sneaker.backend.dto.review;

import lombok.Data;

import java.time.LocalDateTime;

@Data
public class ReviewDTO {
    private Long id;
    private Integer rating;
    private String comment;
    private String username; // Tên người hiển thị trên giao diện
    private LocalDateTime createdAt;
}