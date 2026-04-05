package com.projects.expensetracker.dashboard;

import com.fasterxml.jackson.databind.JsonNode;
import com.projects.expensetracker.AbstractIntegrationTest;
import com.projects.expensetracker.category.entity.Category;
import com.projects.expensetracker.transaction.entity.TransactionType;
import com.projects.expensetracker.user.entity.AppUser;
import org.junit.jupiter.api.Test;

import java.math.BigDecimal;
import java.time.LocalDate;

import static org.assertj.core.api.Assertions.assertThat;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

class DashboardIntegrationTest extends AbstractIntegrationTest {

    @Test
    void summaryAggregatesOnlyCurrentUsersTransactions() throws Exception {
        AppUser userA = createUser("dash-a@example.com", "secret123", "User A");
        AppUser userB = createUser("dash-b@example.com", "secret123", "User B");

        Category salary = createCategory(userA, "Salary", TransactionType.INCOME);
        Category food = createCategory(userA, "Food", TransactionType.EXPENSE);
        Category foreign = createCategory(userB, "Private", TransactionType.EXPENSE);

        createTransaction(userA, salary, TransactionType.INCOME, new BigDecimal("1000.00"), LocalDate.of(2026, 4, 5), "Salary");
        createTransaction(userA, food, TransactionType.EXPENSE, new BigDecimal("300.00"), LocalDate.of(2026, 4, 5), "Food");
        createTransaction(userB, foreign, TransactionType.EXPENSE, new BigDecimal("999.00"), LocalDate.of(2026, 4, 5), "Private");

        var result = mockMvc.perform(get("/api/dashboard/summary")
                        .header("Authorization", "Bearer " + tokenFor(userA))
                        .param("fromDate", "2026-04-01")
                        .param("toDate", "2026-04-30"))
                .andExpect(status().isOk())
                .andReturn();

        JsonNode json = readJson(result);

        assertThat(json.get("userId").asLong()).isEqualTo(userA.getId());
        assertThat(json.get("transactionCount").asLong()).isEqualTo(2L);
        assertThat(json.get("totalIncome").decimalValue()).isEqualByComparingTo("1000.00");
        assertThat(json.get("totalExpense").decimalValue()).isEqualByComparingTo("300.00");
        assertThat(json.get("balance").decimalValue()).isEqualByComparingTo("700.00");
        assertThat(json.get("categorySummaries")).hasSize(2);
    }

    @Test
    void currentMonthSummaryUsesAuthenticatedUser() throws Exception {
        AppUser userA = createUser("dash-month-a@example.com", "secret123", "User A");
        AppUser userB = createUser("dash-month-b@example.com", "secret123", "User B");

        LocalDate today = LocalDate.now();
        Category salary = createCategory(userA, "Salary", TransactionType.INCOME);
        Category foreign = createCategory(userB, "Private", TransactionType.EXPENSE);

        createTransaction(userA, salary, TransactionType.INCOME, new BigDecimal("500.00"), today, "Salary");
        createTransaction(userB, foreign, TransactionType.EXPENSE, new BigDecimal("999.00"), today, "Private");

        var result = mockMvc.perform(get("/api/dashboard/summary/current-month")
                        .header("Authorization", "Bearer " + tokenFor(userA)))
                .andExpect(status().isOk())
                .andReturn();

        JsonNode json = readJson(result);

        assertThat(json.get("userId").asLong()).isEqualTo(userA.getId());
        assertThat(json.get("transactionCount").asLong()).isEqualTo(1L);
        assertThat(json.get("totalIncome").decimalValue()).isEqualByComparingTo("500.00");
        assertThat(json.get("totalExpense").decimalValue()).isEqualByComparingTo("0");
    }
}
