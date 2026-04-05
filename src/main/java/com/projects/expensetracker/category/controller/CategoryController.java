package com.projects.expensetracker.category.controller;

import com.projects.expensetracker.category.dto.CategoryCreateRequest;
import com.projects.expensetracker.category.dto.CategoryResponse;
import com.projects.expensetracker.category.dto.CategoryUpdateRequest;
import com.projects.expensetracker.category.service.CategoryService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/categories")
public class CategoryController {

    private final CategoryService categoryService;

    public CategoryController(CategoryService categoryService) {
        this.categoryService = categoryService;
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public CategoryResponse createCategory(@Valid @RequestBody CategoryCreateRequest request) {
        return categoryService.createCategory(request);
    }

    @GetMapping
    public List<CategoryResponse> getCategories() {
        return categoryService.getCategories();
    }

    @PutMapping("/{categoryId}")
    public CategoryResponse updateCategory(@PathVariable Long categoryId,
                                           @Valid @RequestBody CategoryUpdateRequest request) {
        return categoryService.updateCategory(categoryId, request);
    }

    @DeleteMapping("/{categoryId}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deleteCategory(@PathVariable Long categoryId) {
        categoryService.deleteCategory(categoryId);
    }
}
