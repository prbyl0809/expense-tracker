package com.projects.expensetracker.transaction.service;

import com.projects.expensetracker.category.entity.Category;
import com.projects.expensetracker.category.repository.CategoryRepository;
import com.projects.expensetracker.common.dto.PagedResponse;
import com.projects.expensetracker.exception.ResourceNotFoundException;
import com.projects.expensetracker.security.AuthenticatedUserService;
import com.projects.expensetracker.transaction.dto.TransactionCreateRequest;
import com.projects.expensetracker.transaction.dto.TransactionFilterRequest;
import com.projects.expensetracker.transaction.dto.TransactionResponse;
import com.projects.expensetracker.transaction.dto.TransactionUpdateRequest;
import com.projects.expensetracker.transaction.entity.FinancialTransaction;
import com.projects.expensetracker.transaction.repository.FinancialTransactionRepository;
import com.projects.expensetracker.transaction.specification.FinancialTransactionSpecification;
import com.projects.expensetracker.user.entity.AppUser;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.LinkedHashSet;
import java.util.List;
import java.util.Set;

@Service
@Transactional
public class TransactionService {

    private final FinancialTransactionRepository financialTransactionRepository;
    private final CategoryRepository categoryRepository;
    private final AuthenticatedUserService authenticatedUserService;

    public TransactionService(FinancialTransactionRepository financialTransactionRepository,
                              CategoryRepository categoryRepository,
                              AuthenticatedUserService authenticatedUserService) {
        this.financialTransactionRepository = financialTransactionRepository;
        this.categoryRepository = categoryRepository;
        this.authenticatedUserService = authenticatedUserService;
    }

    public TransactionResponse createTransaction(TransactionCreateRequest request) {
        AppUser user = authenticatedUserService.getCurrentUser();

        Category category = categoryRepository.findByIdAndUser(request.getCategoryId(), user)
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
    public PagedResponse<TransactionResponse> getTransactions(Pageable pageable) {
        AppUser user = authenticatedUserService.getCurrentUser();

        Page<TransactionResponse> page = financialTransactionRepository.findByUser(user, sanitizePageable(pageable))
                .map(this::mapToResponse);

        return PagedResponse.from(page);
    }

    @Transactional(readOnly = true)
    public PagedResponse<TransactionResponse> filterTransactions(TransactionFilterRequest filter, Pageable pageable) {
        if (filter.getFromDate() != null && filter.getToDate() != null
                && filter.getFromDate().isAfter(filter.getToDate())) {
            throw new IllegalArgumentException("fromDate must be before or equal to toDate");
        }

        AppUser user = authenticatedUserService.getCurrentUser();

        Page<TransactionResponse> page = financialTransactionRepository.findAll(
                        FinancialTransactionSpecification.withFilters(user, filter),
                        sanitizePageable(pageable)
                )
                .map(this::mapToResponse);

        return PagedResponse.from(page);
    }

    @Transactional(readOnly = true)
    public TransactionResponse getTransactionById(Long transactionId) {
        AppUser user = authenticatedUserService.getCurrentUser();

        FinancialTransaction transaction = financialTransactionRepository.findByIdAndUser(transactionId, user)
                .orElseThrow(() -> new ResourceNotFoundException("Transaction not found with id: " + transactionId));

        return mapToResponse(transaction);
    }

    public TransactionResponse updateTransaction(Long transactionId, TransactionUpdateRequest request) {
        AppUser user = authenticatedUserService.getCurrentUser();

        FinancialTransaction transaction = financialTransactionRepository.findByIdAndUser(transactionId, user)
                .orElseThrow(() -> new ResourceNotFoundException("Transaction not found with id: " + transactionId));

        Category category = categoryRepository.findByIdAndUser(request.getCategoryId(), user)
                .orElseThrow(() -> new ResourceNotFoundException("Category not found with id: " + request.getCategoryId()));

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
        AppUser user = authenticatedUserService.getCurrentUser();

        FinancialTransaction transaction = financialTransactionRepository.findByIdAndUser(transactionId, user)
                .orElseThrow(() -> new ResourceNotFoundException("Transaction not found with id: " + transactionId));

        financialTransactionRepository.delete(transaction);
    }

    private Pageable sanitizePageable(Pageable pageable) {
        if (pageable == null) {
            return Pageable.unpaged();
        }

        Set<String> allowedSortProperties = Set.of("id", "amount", "type", "description", "date", "createdAt");
        List<Sort.Order> orders = pageable.getSort().stream()
                .filter(order -> allowedSortProperties.contains(order.getProperty()))
                .toList();

        LinkedHashSet<Sort.Order> finalOrders = new LinkedHashSet<>(orders);

        boolean hasDateSort = finalOrders.stream().anyMatch(order -> order.getProperty().equals("date"));
        boolean hasIdSort = finalOrders.stream().anyMatch(order -> order.getProperty().equals("id"));

        if (!hasDateSort) {
            finalOrders.add(Sort.Order.desc("date"));
        }

        if (!hasIdSort) {
            finalOrders.add(Sort.Order.desc("id"));
        }

        return org.springframework.data.domain.PageRequest.of(
                pageable.getPageNumber(),
                pageable.getPageSize(),
                Sort.by(finalOrders.stream().toList())
        );
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
