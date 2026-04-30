package com.sneaker.backend.repository;

import com.sneaker.backend.entity.ProductVariantSize;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ProductVariantSizeRepository extends JpaRepository<ProductVariantSize, Long> {
    List<ProductVariantSize> findByVariantId(Long variantId);
}