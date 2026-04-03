package com.projects.expensetracker.dashboard.controller;

import com.projects.expensetracker.dashboard.dto.DashboardSummaryRequest;
import com.projects.expensetracker.dashboard.dto.DashboardSummaryResponse;
import com.projects.expensetracker.dashboard.service.DashboardService;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/dashboard")
public class DashboardController {

    private final DashboardService dashboardService;

    public DashboardController(DashboardService dashboardService) {
        this.dashboardService = dashboardService;
    }

    @GetMapping("/summary")
    public DashboardSummaryResponse getSummary(@ModelAttribute DashboardSummaryRequest request) {
        return dashboardService.getSummary(request);
    }

    @GetMapping("/summary/current-month")
    public DashboardSummaryResponse getCurrentMonthSummary(@RequestParam Long userId) {
        return dashboardService.getCurrentMonthSummary(userId);
    }
}