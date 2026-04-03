package com.projects.expensetracker.dashboard.dto;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

public class DashboardSummaryResponse {

    private Long userId;
    private LocalDate fromDate;
    private LocalDate toDate;
    private BigDecimal totalIncome;
    private BigDecimal totalExpense;
    private BigDecimal balance;
    private Long transactionCount;
    private List<CategorySummaryResponse> categorySummaries;

    public DashboardSummaryResponse() {
    }

    public DashboardSummaryResponse(Long userId,
                                    LocalDate fromDate,
                                    LocalDate toDate,
                                    BigDecimal totalIncome,
                                    BigDecimal totalExpense,
                                    BigDecimal balance,
                                    Long transactionCount,
                                    List<CategorySummaryResponse> categorySummaries) {
        this.userId = userId;
        this.fromDate = fromDate;
        this.toDate = toDate;
        this.totalIncome = totalIncome;
        this.totalExpense = totalExpense;
        this.balance = balance;
        this.transactionCount = transactionCount;
        this.categorySummaries = categorySummaries;
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

    public BigDecimal getTotalIncome() {
        return totalIncome;
    }

    public BigDecimal getTotalExpense() {
        return totalExpense;
    }

    public BigDecimal getBalance() {
        return balance;
    }

    public Long getTransactionCount() {
        return transactionCount;
    }

    public List<CategorySummaryResponse> getCategorySummaries() {
        return categorySummaries;
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

    public void setTotalIncome(BigDecimal totalIncome) {
        this.totalIncome = totalIncome;
    }

    public void setTotalExpense(BigDecimal totalExpense) {
        this.totalExpense = totalExpense;
    }

    public void setBalance(BigDecimal balance) {
        this.balance = balance;
    }

    public void setTransactionCount(Long transactionCount) {
        this.transactionCount = transactionCount;
    }

    public void setCategorySummaries(List<CategorySummaryResponse> categorySummaries) {
        this.categorySummaries = categorySummaries;
    }
}