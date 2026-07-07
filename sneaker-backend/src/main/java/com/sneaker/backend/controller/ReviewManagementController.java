package com.sneaker.backend.controller;

import com.sneaker.backend.dto.review.ReviewRequest;
import com.sneaker.backend.dto.review.ReviewResponse;
import com.sneaker.backend.service.ReviewService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/reviews")
public class ReviewManagementController {

    @Autowired
    private ReviewService reviewService;

    @GetMapping("/can-review/{productId}")
    public Map<String, Object> canReview(@PathVariable Long productId) {
        return reviewService.canReview(productId);
    }

    @PutMapping("/{reviewId}")
    public ReviewResponse updateReview(@PathVariable Long reviewId,
                                       @Valid @RequestBody ReviewRequest request) {
        return reviewService.updateReview(reviewId, request);
    }

    @DeleteMapping("/{reviewId}")
    public void deleteReview(@PathVariable Long reviewId) {
        reviewService.deleteReview(reviewId);
    }
}
