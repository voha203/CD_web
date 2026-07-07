package com.sneaker.backend.repository;

import com.sneaker.backend.entity.ShippingAddress;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface ShippingAddressRepository extends JpaRepository<ShippingAddress, Long> {
    List<ShippingAddress> findByUserIdOrderByIsDefaultDescCreatedAtDesc(Long userId);

    Optional<ShippingAddress> findByIdAndUserId(Long id, Long userId);

    boolean existsByUserId(Long userId);

    Optional<ShippingAddress> findFirstByUserIdOrderByCreatedAtDesc(Long userId);
}
