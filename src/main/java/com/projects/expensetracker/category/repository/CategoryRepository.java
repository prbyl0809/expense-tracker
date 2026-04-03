package com.projects.expensetracker.category.repository;

import com.projects.expensetracker.category.entity.Category;
import com.projects.expensetracker.transaction.entity.TransactionType;
import com.projects.expensetracker.user.entity.AppUser;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface CategoryRepository extends JpaRepository<Category, Long> {
    List<Category> findByUser(AppUser user);
    List<Category> findByUserAndType(AppUser user, TransactionType type);
}