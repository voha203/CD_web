package com.sneaker.backend.task;

import com.sneaker.backend.entity.Order;
import com.sneaker.backend.entity.OrderItem;
import com.sneaker.backend.entity.ProductVariantSize;
import com.sneaker.backend.repository.OrderRepository;
import com.sneaker.backend.repository.ProductVariantSizeRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Component
@RequiredArgsConstructor
@Slf4j  // In log ra console
public class OrderCleanupTask {

    private final OrderRepository orderRepository;
    private final ProductVariantSizeRepository variantSizeRepository;

    @Transactional
    @Scheduled(fixedRate = 300000)  // Chạy ngầm mỗi 5 phút (300,000 ms)
    public void cancelPendingOrders() {
        // Lấy mốc thời gian trước hiện tại 15 phút
        LocalDateTime timeLimit = LocalDateTime.now().minusMinutes(15);

        // Tìm các đơn PENDING quá hạn
        List<Order> pendingOrders = new ArrayList<>();
        pendingOrders.addAll(orderRepository.findByStatusAndPaymentStatusAndCreatedAtBefore("PENDING", "UNPAID", timeLimit));
        pendingOrders.addAll(orderRepository.findByStatusAndPaymentStatusAndCreatedAtBefore("PENDING", "FAILED", timeLimit));

        if (!pendingOrders.isEmpty()) {
            for (Order order : pendingOrders) {
                // Đổi trạng thái đơn thành CANCELLED
                order.setStatus("CANCELLED");
                order.setPaymentStatus("FAILED");
                order.setCancelReason("Đơn online chưa thanh toán quá 15 phút");
                order.setCancelledAt(LocalDateTime.now());

                // HOÀN TRẢ TỒN KHO: Duyệt qua từng sản phẩm trong đơn bị hủy
                for (OrderItem item : order.getItems()) {
                    ProductVariantSize variantSize = item.getVariantSize();
                    // Cộng lại số lượng vào kho
                    variantSize.setQuantity(variantSize.getQuantity() + item.getQuantity());
                    // Lưu lại kho
                    variantSizeRepository.save(variantSize);
                }
            }
            orderRepository.saveAll(pendingOrders);
            log.info("Hệ thống tự động: Đã hủy và hoàn kho thành công {} đơn hàng treo!", pendingOrders.size());
        }
    }
}
