package com.projects.expensetracker.security;

import com.projects.expensetracker.exception.ResourceNotFoundException;
import com.projects.expensetracker.user.entity.AppUser;
import com.projects.expensetracker.user.repository.AppUserRepository;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

@Service
public class AuthenticatedUserService {

    private final AppUserRepository appUserRepository;

    public AuthenticatedUserService(AppUserRepository appUserRepository) {
        this.appUserRepository = appUserRepository;
    }

    public AppUser getCurrentUser() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

        if (authentication == null || authentication.getName() == null) {
            throw new IllegalArgumentException("No authenticated user found");
        }

        String email = authentication.getName();

        return appUserRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("Authenticated user not found with email: " + email));
    }
}