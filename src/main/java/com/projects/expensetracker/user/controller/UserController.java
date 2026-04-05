package com.projects.expensetracker.user.controller;

import com.projects.expensetracker.security.AuthenticatedUserService;
import com.projects.expensetracker.user.entity.AppUser;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
@RequestMapping("/api/users")
public class UserController {

    private final AuthenticatedUserService authenticatedUserService;

    public UserController(AuthenticatedUserService authenticatedUserService) {
        this.authenticatedUserService = authenticatedUserService;
    }

    @GetMapping("/me")
    public Map<String, Object> getCurrentUser() {
        AppUser user = authenticatedUserService.getCurrentUser();

        return Map.of(
                "id", user.getId(),
                "email", user.getEmail(),
                "displayName", user.getDisplayName()
        );
    }
}