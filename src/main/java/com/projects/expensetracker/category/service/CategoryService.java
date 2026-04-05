package com.projects.expensetracker.category.service;

import com.projects.expensetracker.category.dto.CategoryCreateRequest;
import com.projects.expensetracker.category.dto.CategoryResponse;
import com.projects.expensetracker.category.dto.CategoryUpdateRequest;
import com.projects.expensetracker.category.entity.Category;
import com.projects.expensetracker.category.repository.CategoryRepository;
import com.projects.expensetracker.exception.ResourceNotFoundException;
import com.projects.expensetracker.security.AuthenticatedUserService;
import com.projects.expensetracker.transaction.repository.FinancialTransactionRepository;
import com.projects.expensetracker.user.entity.AppUser;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@Transactional
public class CategoryService {

    private final CategoryRepository categoryRepository;
    private final AuthenticatedUserService authenticatedUserService;
    private final FinancialTransactionRepository financialTransactionRepository;

    public CategoryService(CategoryRepository categoryRepository,
                           AuthenticatedUserService authenticatedUserService,
                           FinancialTransactionRepository financialTransactionRepository) {
        this.categoryRepository = categoryRepository;
        this.authenticatedUserService = authenticatedUserService;
        this.financialTransactionRepository = financialTransactionRepository;
    }

    public CategoryResponse createCategory(CategoryCreateRequest request) {
        AppUser user = authenticatedUserService.getCurrentUser();

        Category category = new Category();
        category.setName(request.getName());
        category.setType(request.getType());
        category.setUser(user);

        Category savedCategory = categoryRepository.save(category);

        return mapToResponse(savedCategory);
    }

    @Transactional(readOnly = true)
    public List<CategoryResponse> getCategories() {
        AppUser user = authenticatedUserService.getCurrentUser();

        return categoryRepository.findByUser(user)
                .stream()
                .map(this::mapToResponse)
                .toList();
    }

    public CategoryResponse updateCategory(Long categoryId, CategoryUpdateRequest request) {
        Category category = getCurrentUsersCategory(categoryId);

        category.setName(request.getName());
        category.setType(request.getType());

        Category updatedCategory = categoryRepository.save(category);

        return mapToResponse(updatedCategory);
    }

    public void deleteCategory(Long categoryId) {
        Category category = getCurrentUsersCategory(categoryId);

        if (financialTransactionRepository.existsByCategory(category)) {
            throw new IllegalArgumentException("Category cannot be deleted while transactions still reference it");
        }

        categoryRepository.delete(category);
    }

    private Category getCurrentUsersCategory(Long categoryId) {
        AppUser user = authenticatedUserService.getCurrentUser();

        return categoryRepository.findByIdAndUser(categoryId, user)
                .orElseThrow(() -> new ResourceNotFoundException("Category not found with id: " + categoryId));
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
