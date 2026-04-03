package com.projects.expensetracker.dashboard.dto;

import com.projects.expensetracker.transaction.entity.TransactionType;

import java.math.BigDecimal;

public class CategorySummaryResponse {

    private Long categoryId;
    private String categoryName;
    private TransactionType type;
    private Number totalAmount;
    private Long transactionCount;

    public CategorySummaryResponse() {
    }

    public CategorySummaryResponse(Long categoryId,
                                   String categoryName,
                                   TransactionType type,
                                   Number totalAmount,
                                   Long transactionCount) {
        this.categoryId = categoryId;
        this.categoryName = categoryName;
        this.type = type;
        this.totalAmount = totalAmount;
        this.transactionCount = transactionCount;
    }

    public Long getCategoryId() {
        return categoryId;
    }

    public String getCategoryName() {
        return categoryName;
    }

    public TransactionType getType() {
        return type;
    }

    public Number getTotalAmount() {
        return totalAmount;
    }

    public Long getTransactionCount() {
        return transactionCount;
    }

    public void setCategoryId(Long categoryId) {
        this.categoryId = categoryId;
    }

    public void setCategoryName(String categoryName) {
        this.categoryName = categoryName;
    }

    public void setType(TransactionType type) {
        this.type = type;
    }

    public void setTotalAmount(BigDecimal totalAmount) {
        this.totalAmount = totalAmount;
    }

    public void setTransactionCount(Long transactionCount) {
        this.transactionCount = transactionCount;
    }
}