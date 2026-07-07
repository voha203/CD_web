package com.sneaker.backend.dto.review;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class ReviewSummaryResponse {
    private Double averageRating;
    private Integer totalReviews;
}
