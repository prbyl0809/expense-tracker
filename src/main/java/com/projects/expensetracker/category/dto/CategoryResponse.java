package com.projects.expensetracker.category.dto;

import com.projects.expensetracker.transaction.entity.TransactionType;

import java.time.LocalDateTime;

public class CategoryResponse {

    private Long id;
    private String name;
    private TransactionType type;
    private Long userId;
    private LocalDateTime createdAt;

    public CategoryResponse() {
    }

    public CategoryResponse(Long id, String name, TransactionType type, Long userId, LocalDateTime createdAt) {
        this.id = id;
        this.name = name;
        this.type = type;
        this.userId = userId;
        this.createdAt = createdAt;
    }

    public Long getId() {
        return id;
    }

    public String getName() {
        return name;
    }

    public TransactionType getType() {
        return type;
    }

    public Long getUserId() {
        return userId;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public void setName(String name) {
        this.name = name;
    }

    public void setType(TransactionType type) {
        this.type = type;
    }

    public void setUserId(Long userId) {
        this.userId = userId;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
}