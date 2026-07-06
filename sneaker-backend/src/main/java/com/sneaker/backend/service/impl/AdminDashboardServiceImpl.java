package com.sneaker.backend.service.impl;

import com.sneaker.backend.dto.admin.AdminDashboardSummaryResponse;
import com.sneaker.backend.dto.admin.RevenueStatResponse;
import com.sneaker.backend.entity.Order;
import com.sneaker.backend.repository.OrderRepository;
import com.sneaker.backend.repository.ProductRepository;
import com.sneaker.backend.repository.UserRepository;
import com.sneaker.backend.service.AdminDashboardService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.YearMonth;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

@Service
public class AdminDashboardServiceImpl implements AdminDashboardService {

    private static final DateTimeFormatter DAY_FORMAT = DateTimeFormatter.ISO_LOCAL_DATE;
    private static final DateTimeFormatter MONTH_FORMAT = DateTimeFormatter.ofPattern("yyyy-MM");

    @Autowired
    private OrderRepository orderRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private ProductRepository productRepository;

    @Override
    public AdminDashboardSummaryResponse getSummary() {
        List<Order> orders = orderRepository.findAll();

        return AdminDashboardSummaryResponse.builder()
                .totalRevenue(orders.stream().filter(this::isRevenueOrder).mapToDouble(this::getPayableAmount).sum())
                .totalOrders(orders.size())
                .totalUsers(userRepository.count())
                .totalProducts(productRepository.count())
                .pendingOrders(countByStatus(orders, "PENDING"))
                .paidOrders(orders.stream().filter(order -> "PAID".equals(order.getPaymentStatus())).count())
                .cancelledOrders(countByStatus(orders, "CANCELLED"))
                .refundPendingOrders(orders.stream().filter(order -> "REFUND_PENDING".equals(order.getPaymentStatus())).count())
                .build();
    }

    @Override
    public List<RevenueStatResponse> getRevenue(String range) {
        String normalizedRange = range == null ? "7d" : range.toLowerCase();
        return "month".equals(normalizedRange) ? getMonthlyRevenue() : getDailyRevenue(normalizedRange);
    }

    private List<RevenueStatResponse> getDailyRevenue(String range) {
        int days = "30d".equals(range) ? 30 : 7;
        LocalDate startDate = LocalDate.now().minusDays(days - 1L);
        Map<String, RevenueBucket> buckets = new LinkedHashMap<>();

        for (int i = 0; i < days; i++) {
            String label = startDate.plusDays(i).format(DAY_FORMAT);
            buckets.put(label, new RevenueBucket());
        }

        orderRepository.findAll().stream()
                .filter(this::isRevenueOrder)
                .filter(order -> order.getCreatedAt() != null)
                .filter(order -> !order.getCreatedAt().toLocalDate().isBefore(startDate))
                .forEach(order -> {
                    String label = order.getCreatedAt().toLocalDate().format(DAY_FORMAT);
                    addRevenue(buckets, label, order);
                });

        return toResponseList(buckets);
    }

    private List<RevenueStatResponse> getMonthlyRevenue() {
        YearMonth startMonth = YearMonth.now().minusMonths(11);
        Map<String, RevenueBucket> buckets = new LinkedHashMap<>();

        for (int i = 0; i < 12; i++) {
            String label = startMonth.plusMonths(i).format(MONTH_FORMAT);
            buckets.put(label, new RevenueBucket());
        }

        orderRepository.findAll().stream()
                .filter(this::isRevenueOrder)
                .filter(order -> order.getCreatedAt() != null)
                .filter(order -> !YearMonth.from(order.getCreatedAt()).isBefore(startMonth))
                .forEach(order -> {
                    String label = YearMonth.from(order.getCreatedAt()).format(MONTH_FORMAT);
                    addRevenue(buckets, label, order);
                });

        return toResponseList(buckets);
    }

    private void addRevenue(Map<String, RevenueBucket> buckets, String label, Order order) {
        RevenueBucket bucket = buckets.get(label);
        if (bucket == null) return;

        bucket.revenue += getPayableAmount(order);
        bucket.orders += 1;
    }

    private List<RevenueStatResponse> toResponseList(Map<String, RevenueBucket> buckets) {
        List<RevenueStatResponse> response = new ArrayList<>();
        buckets.forEach((label, bucket) -> response.add(new RevenueStatResponse(label, bucket.revenue, bucket.orders)));
        return response;
    }

    private long countByStatus(List<Order> orders, String status) {
        return orders.stream().filter(order -> status.equals(order.getStatus())).count();
    }

    private boolean isRevenueOrder(Order order) {
        // Revenue is counted only for online-paid orders or COD orders that have been delivered.
        return "PAID".equals(order.getPaymentStatus())
                || ("COD_PENDING".equals(order.getPaymentStatus()) && "DELIVERED".equals(order.getStatus()));
    }

    private double getPayableAmount(Order order) {
        return order.getFinalAmount() > 0 ? order.getFinalAmount() : order.getTotalAmount();
    }

    private static class RevenueBucket {
        private double revenue;
        private long orders;
    }
}
