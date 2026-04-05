package com.projects.expensetracker.category.service;

import com.projects.expensetracker.category.dto.CategoryCreateRequest;
import com.projects.expensetracker.category.dto.CategoryResponse;
import com.projects.expensetracker.category.entity.Category;
import com.projects.expensetracker.category.repository.CategoryRepository;
import com.projects.expensetracker.security.AuthenticatedUserService;
import com.projects.expensetracker.user.entity.AppUser;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@Transactional
public class CategoryService {

    private final CategoryRepository categoryRepository;
    private final AuthenticatedUserService authenticatedUserService;

    public CategoryService(CategoryRepository categoryRepository,
                           AuthenticatedUserService authenticatedUserService) {
        this.categoryRepository = categoryRepository;
        this.authenticatedUserService = authenticatedUserService;
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
