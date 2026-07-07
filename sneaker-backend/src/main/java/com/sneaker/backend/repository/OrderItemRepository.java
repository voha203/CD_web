package com.sneaker.backend.repository;

import com.sneaker.backend.entity.OrderItem;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface OrderItemRepository extends JpaRepository<OrderItem, Long> {
    @Query("SELECT oi.variantSize.variant.product.id FROM OrderItem oi WHERE oi.order.id = :orderId")
    List<Long> findProductIdsByOrderId(@Param("orderId") Long orderId);

    boolean existsByVariantSizeVariantProductId(Long productId);

    boolean existsByVariantSizeVariantId(Long variantId);

    @Query("""
            SELECT oi.order
            FROM OrderItem oi
            WHERE oi.order.user.id = :userId
              AND oi.variantSize.variant.product.id = :productId
              AND oi.order.status = 'DELIVERED'
            ORDER BY oi.order.createdAt DESC
            """)
    List<com.sneaker.backend.entity.Order> findDeliveredOrdersForReview(@Param("userId") Long userId,
                                                                         @Param("productId") Long productId);
}
