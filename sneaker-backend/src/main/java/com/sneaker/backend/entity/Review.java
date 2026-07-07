package com.sneaker.backend.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "reviews")
public class Review {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // Cột lưu điểm đánh giá (bắt buộc nhập từ 1 đến 5)
    @Column(nullable = false)
    private Integer rating;

    // Cột lưu nội dung bình luận (có thể dài, dùng TEXT)
    // Cho phép null vì có người chỉ thích rate sao mà không muốn viết chữ
    @Column(columnDefinition = "TEXT")
    private String comment;

    // Liên kết với bảng Product (Nhiều Review thuộc về 1 Product)
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "product_id", nullable = false)
    private Product product;

    // Liên kết với bảng User (Nhiều Review do 1 User viết)
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "order_id")
    private Order order;

    // Lưu lại thời gian khách hàng viết đánh giá
    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    // Hàm tự động gán thời gian hiện tại khi lưu vào DB lần đầu
    @PrePersist
    protected void onCreate() {
        this.createdAt = LocalDateTime.now();
        this.updatedAt = LocalDateTime.now();
    }

    @PreUpdate
    protected void onUpdate() {
        this.updatedAt = LocalDateTime.now();
    }
}
