package com.projects.expensetracker.transaction.service;

import com.projects.expensetracker.category.entity.Category;
import com.projects.expensetracker.category.repository.CategoryRepository;
import com.projects.expensetracker.exception.ResourceNotFoundException;
import com.projects.expensetracker.transaction.dto.TransactionCreateRequest;
import com.projects.expensetracker.transaction.dto.TransactionFilterRequest;
import com.projects.expensetracker.transaction.dto.TransactionResponse;
import com.projects.expensetracker.transaction.dto.TransactionUpdateRequest;
import com.projects.expensetracker.transaction.entity.FinancialTransaction;
import com.projects.expensetracker.transaction.repository.FinancialTransactionRepository;
import com.projects.expensetracker.transaction.specification.FinancialTransactionSpecification;
import com.projects.expensetracker.user.entity.AppUser;
import com.projects.expensetracker.user.repository.AppUserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@Transactional
public class TransactionService {

    private final FinancialTransactionRepository financialTransactionRepository;
    private final AppUserRepository appUserRepository;
    private final CategoryRepository categoryRepository;

    public TransactionService(FinancialTransactionRepository financialTransactionRepository,
                              AppUserRepository appUserRepository,
                              CategoryRepository categoryRepository) {
        this.financialTransactionRepository = financialTransactionRepository;
        this.appUserRepository = appUserRepository;
        this.categoryRepository = categoryRepository;
    }

    public TransactionResponse createTransaction(TransactionCreateRequest request) {
        AppUser user = appUserRepository.findById(request.getUserId())
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + request.getUserId()));

        Category category = categoryRepository.findById(request.getCategoryId())
                .orElseThrow(() -> new ResourceNotFoundException("Category not found with id: " + request.getCategoryId()));

        validateUserAndCategory(user, category, request.getType());

        FinancialTransaction transaction = new FinancialTransaction();
        transaction.setAmount(request.getAmount());
        transaction.setType(request.getType());
        transaction.setDescription(request.getDescription());
        transaction.setDate(request.getDate());
        transaction.setUser(user);
        transaction.setCategory(category);

        FinancialTransaction savedTransaction = financialTransactionRepository.save(transaction);

        return mapToResponse(savedTransaction);
    }

    @Transactional(readOnly = true)
    public List<TransactionResponse> getTransactionsByUserId(Long userId) {
        AppUser user = appUserRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + userId));

        return financialTransactionRepository.findByUser(user)
                .stream()
                .map(this::mapToResponse)
                .toList();
    }

    @Transactional(readOnly = true)
    public List<TransactionResponse> filterTransactions(TransactionFilterRequest filter) {
        if (filter.getUserId() == null) {
            throw new IllegalArgumentException("User id is required for filtering");
        }

        if (filter.getFromDate() != null && filter.getToDate() != null
                && filter.getFromDate().isAfter(filter.getToDate())) {
            throw new IllegalArgumentException("fromDate must be before or equal to toDate");
        }

        appUserRepository.findById(filter.getUserId())
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + filter.getUserId()));

        return financialTransactionRepository.findAll(FinancialTransactionSpecification.withFilters(filter))
                .stream()
                .map(this::mapToResponse)
                .toList();
    }

    @Transactional(readOnly = true)
    public TransactionResponse getTransactionById(Long transactionId) {
        FinancialTransaction transaction = financialTransactionRepository.findById(transactionId)
                .orElseThrow(() -> new ResourceNotFoundException("Transaction not found with id: " + transactionId));

        return mapToResponse(transaction);
    }

    public TransactionResponse updateTransaction(Long transactionId, TransactionUpdateRequest request) {
        FinancialTransaction transaction = financialTransactionRepository.findById(transactionId)
                .orElseThrow(() -> new ResourceNotFoundException("Transaction not found with id: " + transactionId));

        AppUser user = appUserRepository.findById(request.getUserId())
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + request.getUserId()));

        Category category = categoryRepository.findById(request.getCategoryId())
                .orElseThrow(() -> new ResourceNotFoundException("Category not found with id: " + request.getCategoryId()));

        if (!transaction.getUser().getId().equals(user.getId())) {
            throw new IllegalArgumentException("Transaction does not belong to the given user");
        }

        validateUserAndCategory(user, category, request.getType());

        transaction.setAmount(request.getAmount());
        transaction.setType(request.getType());
        transaction.setDescription(request.getDescription());
        transaction.setDate(request.getDate());
        transaction.setCategory(category);

        FinancialTransaction updatedTransaction = financialTransactionRepository.save(transaction);

        return mapToResponse(updatedTransaction);
    }

    public void deleteTransaction(Long transactionId) {
        FinancialTransaction transaction = financialTransactionRepository.findById(transactionId)
                .orElseThrow(() -> new ResourceNotFoundException("Transaction not found with id: " + transactionId));

        financialTransactionRepository.delete(transaction);
    }

    private void validateUserAndCategory(AppUser user, Category category, com.projects.expensetracker.transaction.entity.TransactionType transactionType) {
        if (!category.getUser().getId().equals(user.getId())) {
            throw new IllegalArgumentException("Category does not belong to the given user");
        }

        if (category.getType() != transactionType) {
            throw new IllegalArgumentException("Transaction type must match category type");
        }
    }

    private TransactionResponse mapToResponse(FinancialTransaction transaction) {
        return new TransactionResponse(
                transaction.getId(),
                transaction.getAmount(),
                transaction.getType(),
                transaction.getDescription(),
                transaction.getDate(),
                transaction.getUser().getId(),
                transaction.getCategory().getId(),
                transaction.getCategory().getName(),
                transaction.getCreatedAt()
        );
    }
}