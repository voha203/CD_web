package com.sneaker.backend.repository;

import com.sneaker.backend.entity.Discount;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface DiscountRepository extends JpaRepository<Discount, Long> {

    List<Discount> findByProductId(Long productId);
    boolean existsByProductIdAndType(Long productId, String type);
}