package com.sneaker.backend.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "orders")
public class Order {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    // Thông tin giao hàng
    private String receiverName;
    private String receiverPhone;
    private String shippingAddress;
    private String note;

    private double totalAmount; // Tổng tiền hóa đơn
    private String paymentMethod; // COD, VNPAY...
    private String paymentStatus; // UNPAID, PAID, COD_PENDING, FAILED, REFUND_PENDING, REFUNDED
    private String status; // PENDING, PROCESSING, SHIPPED, DELIVERED, CANCELLED
    private String cancelReason;
    private LocalDateTime cancelledAt;

    private LocalDateTime createdAt;

    @OneToMany(mappedBy = "order", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<OrderItem> items = new ArrayList<>();

    // Tự động gán thời gian tạo đơn
    @PrePersist
    protected void onCreate() {
        this.createdAt = LocalDateTime.now();
        if (this.status == null) {
            this.status = "PENDING";
        }
        if (this.paymentStatus == null) {
            this.paymentStatus = "COD".equals(this.paymentMethod) ? "COD_PENDING" : "UNPAID";
        }
    }
}
