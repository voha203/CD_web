package com.sneaker.backend.controller;

import com.sneaker.backend.service.AdminDashboardService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/admin/dashboard")
public class AdminDashboardController {

    @Autowired
    private AdminDashboardService dashboardService;

    @GetMapping("/summary")
    public Object getSummary() {
        return dashboardService.getSummary();
    }

    @GetMapping("/revenue")
    public Object getRevenue(@RequestParam(defaultValue = "7d") String range) {
        return dashboardService.getRevenue(range);
    }
}
