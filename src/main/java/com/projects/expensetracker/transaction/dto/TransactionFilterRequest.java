package com.projects.expensetracker.transaction.dto;

import com.projects.expensetracker.transaction.entity.TransactionType;
import org.springframework.format.annotation.DateTimeFormat;

import java.time.LocalDate;

public class TransactionFilterRequest {

    private Long userId;

    @DateTimeFormat(iso = DateTimeFormat.ISO.DATE)
    private LocalDate fromDate;

    @DateTimeFormat(iso = DateTimeFormat.ISO.DATE)
    private LocalDate toDate;

    private TransactionType type;

    private Long categoryId;

    public TransactionFilterRequest() {
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

    public TransactionType getType() {
        return type;
    }

    public Long getCategoryId() {
        return categoryId;
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

    public void setType(TransactionType type) {
        this.type = type;
    }

    public void setCategoryId(Long categoryId) {
        this.categoryId = categoryId;
    }
}