package com.projects.expensetracker.category.dto;

import com.projects.expensetracker.transaction.entity.TransactionType;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

public class CategoryCreateRequest {

    @NotBlank(message = "Category name is required")
    @Size(max = 255, message = "Category name must not exceed 255 characters")
    private String name;

    @NotNull(message = "Category type is required")
    private TransactionType type;

    @NotNull(message = "User id is required")
    private Long userId;

    public CategoryCreateRequest() {
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

    public void setName(String name) {
        this.name = name;
    }

    public void setType(TransactionType type) {
        this.type = type;
    }

    public void setUserId(Long userId) {
        this.userId = userId;
    }
}