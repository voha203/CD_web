package com.sneaker.backend.repository;

import com.sneaker.backend.entity.Product;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

import java.util.List;

public interface ProductRepository extends JpaRepository<Product, Long>, JpaSpecificationExecutor<Product> {
    // Tìm giày CÙNG BRAND nhưng KHÁC ID với những đôi đã mua
    Page<Product> findByBrandInAndIdNotIn(List<String> brands, List<Long> ids, Pageable pageable);

    // Tìm các đôi giày KHÁC ID (dùng khi không đủ giày cùng brand)
    Page<Product> findByIdNotIn(List<Long> ids, Pageable pageable);
}