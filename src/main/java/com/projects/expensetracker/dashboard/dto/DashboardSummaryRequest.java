package com.projects.expensetracker.dashboard.dto;

import org.springframework.format.annotation.DateTimeFormat;

import java.time.LocalDate;

public class DashboardSummaryRequest {

    private Long userId;

    @DateTimeFormat(iso = DateTimeFormat.ISO.DATE)
    private LocalDate fromDate;

    @DateTimeFormat(iso = DateTimeFormat.ISO.DATE)
    private LocalDate toDate;

    public DashboardSummaryRequest() {
    }

    public Long getUserId() {
        return userId;
    }

    public LocalDate getFromDate() {
        return fromDate;
    }

    public LocalDate getToDate() {
        return toDate;
    }

    public void setUserId(Long userId) {
        this.userId = userId;
    }

    public void setFromDate(LocalDate fromDate) {
        this.fromDate = fromDate;
    }

    public void setToDate(LocalDate toDate) {
        this.toDate = toDate;
    }
}