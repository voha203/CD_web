package com.sneaker.backend.service;

import com.sneaker.backend.dto.review.ReviewResponse;
import com.sneaker.backend.dto.review.ReviewRequest;
import com.sneaker.backend.dto.review.ReviewSummaryResponse;
import org.springframework.data.domain.Page;

import java.util.Map;

public interface ReviewService {
    // Thêm đánh giá mới
    ReviewResponse addReview(Long productId, ReviewRequest request);

    // Lấy danh sách đánh giá của sản phẩm (Phân trang)
    Page<ReviewResponse> getReviewsByProduct(Long productId, int page, int size);

    ReviewSummaryResponse getSummary(Long productId);

    Map<String, Object> canReview(Long productId);

    ReviewResponse updateReview(Long reviewId, ReviewRequest request);

    void deleteReview(Long reviewId);
}
