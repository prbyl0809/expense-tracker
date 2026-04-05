package com.projects.expensetracker.transaction;

import com.projects.expensetracker.AbstractIntegrationTest;
import com.projects.expensetracker.category.entity.Category;
import com.projects.expensetracker.transaction.entity.FinancialTransaction;
import com.projects.expensetracker.transaction.entity.TransactionType;
import com.projects.expensetracker.user.entity.AppUser;
import org.junit.jupiter.api.Test;

import java.math.BigDecimal;
import java.time.LocalDate;

import static org.springframework.http.MediaType.APPLICATION_JSON;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.delete;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.put;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

class TransactionIntegrationTest extends AbstractIntegrationTest {

    @Test
    void createTransactionRejectsOtherUsersCategory() throws Exception {
        AppUser userA = createUser("tx-a@example.com", "secret123", "User A");
        AppUser userB = createUser("tx-b@example.com", "secret123", "User B");
        Category foreignCategory = createCategory(userB, "Private", TransactionType.EXPENSE);

        mockMvc.perform(post("/api/transactions")
                        .header("Authorization", "Bearer " + tokenFor(userA))
                        .contentType(APPLICATION_JSON)
                        .content(toJson(new TransactionRequestPayload(
                                new BigDecimal("10.00"),
                                "EXPENSE",
                                "Should fail",
                                LocalDate.of(2026, 4, 5),
                                foreignCategory.getId()
                        ))))
                .andExpect(status().isNotFound())
                .andExpect(jsonPath("$.title").value("Resource not found"));
    }

    @Test
    void transactionReadsAreScopedToCurrentUser() throws Exception {
        AppUser userA = createUser("tx-read-a@example.com", "secret123", "User A");
        AppUser userB = createUser("tx-read-b@example.com", "secret123", "User B");

        Category incomeCategory = createCategory(userA, "Salary", TransactionType.INCOME);
        Category expenseCategory = createCategory(userA, "Food", TransactionType.EXPENSE);
        Category foreignCategory = createCategory(userB, "Other", TransactionType.EXPENSE);

        FinancialTransaction income = createTransaction(
                userA,
                incomeCategory,
                TransactionType.INCOME,
                new BigDecimal("1000.00"),
                LocalDate.of(2026, 4, 5),
                "Salary"
        );
        FinancialTransaction expense = createTransaction(
                userA,
                expenseCategory,
                TransactionType.EXPENSE,
                new BigDecimal("250.00"),
                LocalDate.of(2026, 4, 5),
                "Groceries"
        );
        FinancialTransaction foreignTransaction = createTransaction(
                userB,
                foreignCategory,
                TransactionType.EXPENSE,
                new BigDecimal("999.00"),
                LocalDate.of(2026, 4, 5),
                "Private"
        );

        mockMvc.perform(get("/api/transactions")
                        .header("Authorization", "Bearer " + tokenFor(userA)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.length()").value(2))
                .andExpect(jsonPath("$[?(@.id == %s)]", income.getId()).exists())
                .andExpect(jsonPath("$[?(@.id == %s)]", expense.getId()).exists())
                .andExpect(jsonPath("$[?(@.id == %s)]", foreignTransaction.getId()).isEmpty());

        mockMvc.perform(get("/api/transactions/filter")
                        .header("Authorization", "Bearer " + tokenFor(userA))
                        .param("fromDate", "2026-04-05")
                        .param("toDate", "2026-04-05")
                        .param("type", "EXPENSE"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.length()").value(1))
                .andExpect(jsonPath("$[0].id").value(expense.getId()));

        mockMvc.perform(get("/api/transactions/{transactionId}", foreignTransaction.getId())
                        .header("Authorization", "Bearer " + tokenFor(userA)))
                .andExpect(status().isNotFound());
    }

    @Test
    void transactionUpdateAndDeleteAreScopedToCurrentUser() throws Exception {
        AppUser userA = createUser("tx-write-a@example.com", "secret123", "User A");
        AppUser userB = createUser("tx-write-b@example.com", "secret123", "User B");

        Category expenseCategoryA = createCategory(userA, "Food", TransactionType.EXPENSE);
        Category expenseCategoryB = createCategory(userB, "Private", TransactionType.EXPENSE);

        FinancialTransaction ownTransaction = createTransaction(
                userA,
                expenseCategoryA,
                TransactionType.EXPENSE,
                new BigDecimal("100.00"),
                LocalDate.of(2026, 4, 5),
                "Lunch"
        );
        FinancialTransaction foreignTransaction = createTransaction(
                userB,
                expenseCategoryB,
                TransactionType.EXPENSE,
                new BigDecimal("50.00"),
                LocalDate.of(2026, 4, 5),
                "Private"
        );

        mockMvc.perform(put("/api/transactions/{transactionId}", ownTransaction.getId())
                        .header("Authorization", "Bearer " + tokenFor(userA))
                        .contentType(APPLICATION_JSON)
                        .content(toJson(new TransactionRequestPayload(
                                new BigDecimal("300.00"),
                                "EXPENSE",
                                "Updated lunch",
                                LocalDate.of(2026, 4, 5),
                                expenseCategoryA.getId()
                        ))))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.amount").value(300.00))
                .andExpect(jsonPath("$.description").value("Updated lunch"));

        mockMvc.perform(put("/api/transactions/{transactionId}", foreignTransaction.getId())
                        .header("Authorization", "Bearer " + tokenFor(userA))
                        .contentType(APPLICATION_JSON)
                        .content(toJson(new TransactionRequestPayload(
                                new BigDecimal("75.00"),
                                "EXPENSE",
                                "Should not update",
                                LocalDate.of(2026, 4, 5),
                                expenseCategoryA.getId()
                        ))))
                .andExpect(status().isNotFound());

        mockMvc.perform(delete("/api/transactions/{transactionId}", foreignTransaction.getId())
                        .header("Authorization", "Bearer " + tokenFor(userA)))
                .andExpect(status().isNotFound());

        mockMvc.perform(delete("/api/transactions/{transactionId}", ownTransaction.getId())
                        .header("Authorization", "Bearer " + tokenFor(userA)))
                .andExpect(status().isNoContent());
    }

    private record TransactionRequestPayload(BigDecimal amount,
                                             String type,
                                             String description,
                                             LocalDate date,
                                             Long categoryId) {
    }
}
