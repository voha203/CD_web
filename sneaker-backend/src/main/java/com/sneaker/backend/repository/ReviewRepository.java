package com.sneaker.backend.repository;

import com.sneaker.backend.entity.Review;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ReviewRepository extends JpaRepository<Review, Long> {
    // Lấy danh sách đánh giá của một sản phẩm (Có phân trang, ví dụ: 5 bình luận mỗi trang)
    Page<Review> findByProductId(Long productId, Pageable pageable);
}