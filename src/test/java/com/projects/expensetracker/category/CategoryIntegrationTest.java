package com.projects.expensetracker.category;

import com.projects.expensetracker.AbstractIntegrationTest;
import com.projects.expensetracker.transaction.entity.TransactionType;
import com.projects.expensetracker.user.entity.AppUser;
import org.junit.jupiter.api.Test;

import static org.springframework.http.MediaType.APPLICATION_JSON;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
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

    private record CategoryRequestPayload(String name, String type) {
    }
}
