package com.sneaker.backend.repository;

import com.sneaker.backend.entity.Review;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface ReviewRepository extends JpaRepository<Review, Long> {
    // Lấy danh sách đánh giá của một sản phẩm (Có phân trang, ví dụ: 5 bình luận mỗi trang)
    Page<Review> findByProductId(Long productId, Pageable pageable);

    @Query("SELECT COALESCE(AVG(r.rating), 0.0) FROM Review r WHERE r.product.id = :productId")
    Double getAverageRatingByProductId(@Param("productId") Long productId);

    Integer countByProductId(Long productId);

    boolean existsByUserIdAndProductIdAndOrderId(Long userId, Long productId, Long orderId);

    Optional<Review> findByIdAndUserId(Long id, Long userId);
}
