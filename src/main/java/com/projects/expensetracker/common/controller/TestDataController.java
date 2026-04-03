package com.projects.expensetracker.common.controller;

import com.projects.expensetracker.category.entity.Category;
import com.projects.expensetracker.category.repository.CategoryRepository;
import com.projects.expensetracker.transaction.entity.FinancialTransaction;
import com.projects.expensetracker.transaction.entity.TransactionType;
import com.projects.expensetracker.transaction.repository.FinancialTransactionRepository;
import com.projects.expensetracker.user.entity.AppUser;
import com.projects.expensetracker.user.repository.AppUserRepository;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RestController;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.Map;

@RestController
public class TestDataController {

    private final AppUserRepository appUserRepository;
    private final CategoryRepository categoryRepository;
    private final FinancialTransactionRepository financialTransactionRepository;

    public TestDataController(AppUserRepository appUserRepository,
                              CategoryRepository categoryRepository,
                              FinancialTransactionRepository financialTransactionRepository) {
        this.appUserRepository = appUserRepository;
        this.categoryRepository = categoryRepository;
        this.financialTransactionRepository = financialTransactionRepository;
    }

    @PostMapping("/api/test/seed")
    public Map<String, Object> seedData() {
        if (appUserRepository.existsByEmail("test@example.com")) {
            return Map.of(
                    "message", "Test data already exists"
            );
        }

        AppUser user = new AppUser();
        user.setEmail("test@example.com");
        user.setPasswordHash("dummy-password-hash");
        user.setDisplayName("Test User");
        user = appUserRepository.save(user);

        Category salaryCategory = new Category();
        salaryCategory.setName("Salary");
        salaryCategory.setType(TransactionType.INCOME);
        salaryCategory.setUser(user);
        salaryCategory = categoryRepository.save(salaryCategory);

        Category foodCategory = new Category();
        foodCategory.setName("Food");
        foodCategory.setType(TransactionType.EXPENSE);
        foodCategory.setUser(user);
        foodCategory = categoryRepository.save(foodCategory);

        FinancialTransaction transaction = new FinancialTransaction();
        transaction.setAmount(new BigDecimal("125000.00"));
        transaction.setType(TransactionType.INCOME);
        transaction.setDescription("Monthly salary");
        transaction.setDate(LocalDate.now());
        transaction.setUser(user);
        transaction.setCategory(salaryCategory);
        transaction = financialTransactionRepository.save(transaction);

        return Map.of(
                "message", "Test data created successfully",
                "userId", user.getId(),
                "salaryCategoryId", salaryCategory.getId(),
                "foodCategoryId", foodCategory.getId(),
                "transactionId", transaction.getId()
        );
    }
}