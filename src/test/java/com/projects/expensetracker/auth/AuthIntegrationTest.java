package com.projects.expensetracker.auth;

import com.fasterxml.jackson.databind.JsonNode;
import com.projects.expensetracker.AbstractIntegrationTest;
import com.projects.expensetracker.user.entity.AppUser;
import org.junit.jupiter.api.Test;

import static org.assertj.core.api.Assertions.assertThat;
import static org.springframework.http.MediaType.APPLICATION_JSON;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

class AuthIntegrationTest extends AbstractIntegrationTest {

    @Test
    void registerCreatesUserAndReturnsToken() throws Exception {
        var result = mockMvc.perform(post("/api/auth/register")
                        .contentType(APPLICATION_JSON)
                        .content(toJson(new RegisterRequestPayload(
                                "register@example.com",
                                "secret123",
                                "Register User"
                        ))))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.token").isNotEmpty())
                .andExpect(jsonPath("$.email").value("register@example.com"))
                .andExpect(jsonPath("$.displayName").value("Register User"))
                .andReturn();

        JsonNode json = readJson(result);
        AppUser savedUser = appUserRepository.findByEmail("register@example.com").orElseThrow();

        assertThat(json.get("userId").asLong()).isEqualTo(savedUser.getId());
        assertThat(savedUser.getPasswordHash()).isNotEqualTo("secret123");
        assertThat(passwordEncoder.matches("secret123", savedUser.getPasswordHash())).isTrue();
    }

    @Test
    void loginReturnsTokenForValidCredentials() throws Exception {
        createUser("login@example.com", "secret123", "Login User");

        mockMvc.perform(post("/api/auth/login")
                        .contentType(APPLICATION_JSON)
                        .content(toJson(new LoginRequestPayload("login@example.com", "secret123"))))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.token").isNotEmpty())
                .andExpect(jsonPath("$.email").value("login@example.com"))
                .andExpect(jsonPath("$.displayName").value("Login User"));
    }

    @Test
    void registerRejectsDuplicateEmail() throws Exception {
        createUser("duplicate@example.com", "secret123", "Original User");

        mockMvc.perform(post("/api/auth/register")
                        .contentType(APPLICATION_JSON)
                        .content(toJson(new RegisterRequestPayload(
                                "duplicate@example.com",
                                "secret123",
                                "Duplicate User"
                        ))))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.title").value("Invalid request"))
                .andExpect(jsonPath("$.detail").value("Email is already in use"));
    }

    @Test
    void protectedEndpointRequiresAuthentication() throws Exception {
        mockMvc.perform(get("/api/users/me"))
                .andExpect(status().isUnauthorized());
    }

    private record RegisterRequestPayload(String email, String password, String displayName) {
    }

    private record LoginRequestPayload(String email, String password) {
    }
}
