package com.sneaker.backend.service;

import com.sneaker.backend.dto.admin.AdminDashboardSummaryResponse;
import com.sneaker.backend.dto.admin.RevenueStatResponse;

import java.util.List;

public interface AdminDashboardService {
    AdminDashboardSummaryResponse getSummary();

    List<RevenueStatResponse> getRevenue(String range);
}
