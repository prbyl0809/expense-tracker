package com.projects.expensetracker.dashboard.service;

import com.projects.expensetracker.dashboard.dto.CategorySummaryResponse;
import com.projects.expensetracker.dashboard.dto.DashboardSummaryRequest;
import com.projects.expensetracker.dashboard.dto.DashboardSummaryResponse;
import com.projects.expensetracker.exception.ResourceNotFoundException;
import com.projects.expensetracker.transaction.entity.TransactionType;
import com.projects.expensetracker.transaction.repository.FinancialTransactionRepository;
import com.projects.expensetracker.user.repository.AppUserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

@Service
@Transactional(readOnly = true)
public class DashboardService {

    private final FinancialTransactionRepository financialTransactionRepository;
    private final AppUserRepository appUserRepository;

    public DashboardService(FinancialTransactionRepository financialTransactionRepository,
                            AppUserRepository appUserRepository) {
        this.financialTransactionRepository = financialTransactionRepository;
        this.appUserRepository = appUserRepository;
    }

    public DashboardSummaryResponse getSummary(DashboardSummaryRequest request) {
        if (request.getUserId() == null) {
            throw new IllegalArgumentException("User id is required");
        }

        if (request.getFromDate() == null || request.getToDate() == null) {
            throw new IllegalArgumentException("fromDate and toDate are required");
        }

        if (request.getFromDate().isAfter(request.getToDate())) {
            throw new IllegalArgumentException("fromDate must be before or equal to toDate");
        }

        appUserRepository.findById(request.getUserId())
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + request.getUserId()));

        BigDecimal totalIncome = financialTransactionRepository.sumAmountByUserIdAndTypeAndDateBetween(
                request.getUserId(),
                TransactionType.INCOME,
                request.getFromDate(),
                request.getToDate()
        );

        BigDecimal totalExpense = financialTransactionRepository.sumAmountByUserIdAndTypeAndDateBetween(
                request.getUserId(),
                TransactionType.EXPENSE,
                request.getFromDate(),
                request.getToDate()
        );

        Long transactionCount = financialTransactionRepository.countByUserIdAndDateBetween(
                request.getUserId(),
                request.getFromDate(),
                request.getToDate()
        );

        List<CategorySummaryResponse> categorySummaries = financialTransactionRepository.getCategorySummaries(
                request.getUserId(),
                request.getFromDate(),
                request.getToDate()
        );

        BigDecimal balance = totalIncome.subtract(totalExpense);

        return new DashboardSummaryResponse(
                request.getUserId(),
                request.getFromDate(),
                request.getToDate(),
                totalIncome,
                totalExpense,
                balance,
                transactionCount,
                categorySummaries
        );
    }

    public DashboardSummaryResponse getCurrentMonthSummary(Long userId) {
        LocalDate now = LocalDate.now();
        LocalDate firstDayOfMonth = now.withDayOfMonth(1);
        LocalDate lastDayOfMonth = now.withDayOfMonth(now.lengthOfMonth());

        DashboardSummaryRequest request = new DashboardSummaryRequest();
        request.setUserId(userId);
        request.setFromDate(firstDayOfMonth);
        request.setToDate(lastDayOfMonth);

        return getSummary(request);
    }
}