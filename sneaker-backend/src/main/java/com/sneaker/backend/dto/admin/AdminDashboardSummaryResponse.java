package com.sneaker.backend.dto.admin;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class AdminDashboardSummaryResponse {
    private double totalRevenue;
    private long totalOrders;
    private long totalUsers;
    private long totalProducts;
    private long pendingOrders;
    private long paidOrders;
    private long cancelledOrders;
    private long refundPendingOrders;
}
