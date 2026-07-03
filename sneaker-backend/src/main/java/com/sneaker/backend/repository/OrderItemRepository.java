package com.sneaker.backend.repository;

import com.sneaker.backend.entity.OrderItem;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface OrderItemRepository extends JpaRepository<OrderItem, Long> {
    @Query("SELECT oi.variantSize.variant.product.id FROM OrderItem oi WHERE oi.order.id = :orderId")
    List<Long> findProductIdsByOrderId(@Param("orderId") Long orderId);
}