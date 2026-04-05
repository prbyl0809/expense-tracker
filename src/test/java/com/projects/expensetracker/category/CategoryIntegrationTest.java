package com.projects.expensetracker.category;

import com.projects.expensetracker.AbstractIntegrationTest;
import com.projects.expensetracker.category.entity.Category;
import com.projects.expensetracker.transaction.entity.TransactionType;
import com.projects.expensetracker.user.entity.AppUser;
import org.junit.jupiter.api.Test;

import static org.springframework.http.MediaType.APPLICATION_JSON;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.delete;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.put;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

class CategoryIntegrationTest extends AbstractIntegrationTest {

    @Test
    void createCategoryAssignsAuthenticatedUser() throws Exception {
        AppUser user = createUser("category-owner@example.com", "secret123", "Category Owner");

        mockMvc.perform(post("/api/categories")
                        .header("Authorization", "Bearer " + tokenFor(user))
                        .contentType(APPLICATION_JSON)
                        .content(toJson(new CategoryRequestPayload("Groceries", "EXPENSE"))))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.name").value("Groceries"))
                .andExpect(jsonPath("$.type").value("EXPENSE"))
                .andExpect(jsonPath("$.userId").value(user.getId()));
    }

    @Test
    void listCategoriesReturnsOnlyCurrentUsersCategories() throws Exception {
        AppUser userA = createUser("cat-a@example.com", "secret123", "User A");
        AppUser userB = createUser("cat-b@example.com", "secret123", "User B");

        createCategory(userA, "Salary", TransactionType.INCOME);
        createCategory(userA, "Food", TransactionType.EXPENSE);
        createCategory(userB, "Private", TransactionType.EXPENSE);

        mockMvc.perform(get("/api/categories")
                        .header("Authorization", "Bearer " + tokenFor(userA)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.length()").value(2))
                .andExpect(jsonPath("$[0].userId").value(userA.getId()))
                .andExpect(jsonPath("$[1].userId").value(userA.getId()))
                .andExpect(jsonPath("$[?(@.name == 'Private')]").isEmpty());
    }

    @Test
    void updateCategoryUpdatesCurrentUsersCategory() throws Exception {
        AppUser user = createUser("cat-update@example.com", "secret123", "User");
        Category category = createCategory(user, "Old Name", TransactionType.EXPENSE);

        mockMvc.perform(put("/api/categories/{categoryId}", category.getId())
                        .header("Authorization", "Bearer " + tokenFor(user))
                        .contentType(APPLICATION_JSON)
                        .content(toJson(new CategoryRequestPayload("New Name", "INCOME"))))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(category.getId()))
                .andExpect(jsonPath("$.name").value("New Name"))
                .andExpect(jsonPath("$.type").value("INCOME"))
                .andExpect(jsonPath("$.userId").value(user.getId()));
    }

    @Test
    void updateCategoryRejectsOtherUsersCategory() throws Exception {
        AppUser userA = createUser("cat-update-a@example.com", "secret123", "User A");
        AppUser userB = createUser("cat-update-b@example.com", "secret123", "User B");
        Category foreignCategory = createCategory(userB, "Private", TransactionType.EXPENSE);

        mockMvc.perform(put("/api/categories/{categoryId}", foreignCategory.getId())
                        .header("Authorization", "Bearer " + tokenFor(userA))
                        .contentType(APPLICATION_JSON)
                        .content(toJson(new CategoryRequestPayload("Should Fail", "EXPENSE"))))
                .andExpect(status().isNotFound());
    }

    @Test
    void deleteCategoryDeletesCurrentUsersEmptyCategory() throws Exception {
        AppUser user = createUser("cat-delete@example.com", "secret123", "User");
        Category category = createCategory(user, "Disposable", TransactionType.EXPENSE);

        mockMvc.perform(delete("/api/categories/{categoryId}", category.getId())
                        .header("Authorization", "Bearer " + tokenFor(user)))
                .andExpect(status().isNoContent());

        mockMvc.perform(get("/api/categories")
                        .header("Authorization", "Bearer " + tokenFor(user)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[?(@.id == %s)]", category.getId()).isEmpty());
    }

    @Test
    void deleteCategoryRejectsOtherUsersCategory() throws Exception {
        AppUser userA = createUser("cat-delete-a@example.com", "secret123", "User A");
        AppUser userB = createUser("cat-delete-b@example.com", "secret123", "User B");
        Category foreignCategory = createCategory(userB, "Private", TransactionType.EXPENSE);

        mockMvc.perform(delete("/api/categories/{categoryId}", foreignCategory.getId())
                        .header("Authorization", "Bearer " + tokenFor(userA)))
                .andExpect(status().isNotFound());
    }

    @Test
    void deleteCategoryRejectsCategoryWithTransactions() throws Exception {
        AppUser user = createUser("cat-linked@example.com", "secret123", "User");
        Category category = createCategory(user, "Food", TransactionType.EXPENSE);
        createTransaction(
                user,
                category,
                TransactionType.EXPENSE,
                new java.math.BigDecimal("42.00"),
                java.time.LocalDate.of(2026, 4, 5),
                "Lunch"
        );

        mockMvc.perform(delete("/api/categories/{categoryId}", category.getId())
                        .header("Authorization", "Bearer " + tokenFor(user)))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.title").value("Invalid request"))
                .andExpect(jsonPath("$.detail").value("Category cannot be deleted while transactions still reference it"));
    }

    private record CategoryRequestPayload(String name, String type) {
    }
}
