package com.sneaker.backend.repository;

import com.sneaker.backend.entity.Order;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface OrderRepository extends JpaRepository<Order, Long> {
    List<Order> findByUserId(Long userId); // Lấy lịch sử mua hàng của 1 user

    // Tìm các đơn hàng theo Trạng thái VÀ Thời gian tạo trước một mốc cụ thể
    List<Order> findByStatusAndCreatedAtBefore(String status, LocalDateTime time);

    List<Order> findByStatusAndPaymentStatusAndCreatedAtBefore(String status, String paymentStatus, LocalDateTime time);
}
