package com.sneaker.backend.controller;

import com.sneaker.backend.dto.review.ReviewResponse;
import com.sneaker.backend.dto.review.ReviewRequest;
import com.sneaker.backend.service.ReviewService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/products")
@CrossOrigin("*")
public class ReviewController {

    @Autowired
    private ReviewService reviewService;

    // ==========================================
    // TẠO ĐÁNH GIÁ MỚI
    // POST /api/products/{productId}/reviews
    // ==========================================
    @PostMapping("/{productId}/reviews")
    public ResponseEntity<ReviewResponse> addReview(
            @PathVariable Long productId,
            @RequestBody ReviewRequest request) {

        ReviewResponse createdReview = reviewService.addReview(productId, request);
        return new ResponseEntity<>(createdReview, HttpStatus.CREATED);
    }

    // ==========================================
    // LẤY DANH SÁCH ĐÁNH GIÁ (Có phân trang)
    // GET /api/products/{productId}/reviews?page=0&size=5
    // ==========================================
    @GetMapping("/{productId}/reviews")
    public ResponseEntity<Page<ReviewResponse>> getReviews(
            @PathVariable Long productId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "5") int size) {

        Page<ReviewResponse> reviews = reviewService.getReviewsByProduct(productId, page, size);
        return ResponseEntity.ok(reviews);
    }
}