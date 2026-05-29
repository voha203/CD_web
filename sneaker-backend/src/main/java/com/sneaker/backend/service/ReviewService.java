package com.sneaker.backend.service;

import com.sneaker.backend.dto.review.ReviewDTO;
import com.sneaker.backend.dto.review.ReviewRequest;
import org.springframework.data.domain.Page;

public interface ReviewService {
    // Thêm đánh giá mới
    ReviewDTO addReview(Long productId, ReviewRequest request);

    // Lấy danh sách đánh giá của sản phẩm (Phân trang)
    Page<ReviewDTO> getReviewsByProduct(Long productId, int page, int size);
}