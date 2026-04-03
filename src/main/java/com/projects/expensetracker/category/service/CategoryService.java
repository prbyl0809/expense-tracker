package com.projects.expensetracker.category.service;

import com.projects.expensetracker.category.dto.CategoryCreateRequest;
import com.projects.expensetracker.category.dto.CategoryResponse;
import com.projects.expensetracker.category.entity.Category;
import com.projects.expensetracker.category.repository.CategoryRepository;
import com.projects.expensetracker.exception.ResourceNotFoundException;
import com.projects.expensetracker.user.entity.AppUser;
import com.projects.expensetracker.user.repository.AppUserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@Transactional
public class CategoryService {

    private final CategoryRepository categoryRepository;
    private final AppUserRepository appUserRepository;

    public CategoryService(CategoryRepository categoryRepository, AppUserRepository appUserRepository) {
        this.categoryRepository = categoryRepository;
        this.appUserRepository = appUserRepository;
    }

    public CategoryResponse createCategory(CategoryCreateRequest request) {
        AppUser user = appUserRepository.findById(request.getUserId())
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + request.getUserId()));

        Category category = new Category();
        category.setName(request.getName());
        category.setType(request.getType());
        category.setUser(user);

        Category savedCategory = categoryRepository.save(category);

        return mapToResponse(savedCategory);
    }

    @Transactional(readOnly = true)
    public List<CategoryResponse> getCategoriesByUserId(Long userId) {
        AppUser user = appUserRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + userId));

        return categoryRepository.findByUser(user)
                .stream()
                .map(this::mapToResponse)
                .toList();
    }

    private CategoryResponse mapToResponse(Category category) {
        return new CategoryResponse(
                category.getId(),
                category.getName(),
                category.getType(),
                category.getUser().getId(),
                category.getCreatedAt()
        );
    }
}