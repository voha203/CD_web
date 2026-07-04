package com.sneaker.backend.service;

import com.sneaker.backend.dto.review.ReviewResponse;
import com.sneaker.backend.dto.review.ReviewRequest;
import org.springframework.data.domain.Page;

public interface ReviewService {
    // Thêm đánh giá mới
    ReviewResponse addReview(Long productId, ReviewRequest request);

    // Lấy danh sách đánh giá của sản phẩm (Phân trang)
    Page<ReviewResponse> getReviewsByProduct(Long productId, int page, int size);
}