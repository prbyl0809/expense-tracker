package com.projects.expensetracker.dashboard.service;

import com.projects.expensetracker.dashboard.dto.CategorySummaryResponse;
import com.projects.expensetracker.dashboard.dto.DashboardSummaryRequest;
import com.projects.expensetracker.dashboard.dto.DashboardSummaryResponse;
import com.projects.expensetracker.security.AuthenticatedUserService;
import com.projects.expensetracker.transaction.entity.TransactionType;
import com.projects.expensetracker.transaction.repository.FinancialTransactionRepository;
import com.projects.expensetracker.user.entity.AppUser;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

@Service
@Transactional(readOnly = true)
public class DashboardService {

    private final FinancialTransactionRepository financialTransactionRepository;
    private final AuthenticatedUserService authenticatedUserService;

    public DashboardService(FinancialTransactionRepository financialTransactionRepository,
                            AuthenticatedUserService authenticatedUserService) {
        this.financialTransactionRepository = financialTransactionRepository;
        this.authenticatedUserService = authenticatedUserService;
    }

    public DashboardSummaryResponse getSummary(DashboardSummaryRequest request) {
        if (request.getFromDate() == null || request.getToDate() == null) {
            throw new IllegalArgumentException("fromDate and toDate are required");
        }

        if (request.getFromDate().isAfter(request.getToDate())) {
            throw new IllegalArgumentException("fromDate must be before or equal to toDate");
        }

        AppUser user = authenticatedUserService.getCurrentUser();

        BigDecimal totalIncome = financialTransactionRepository.sumAmountByUserAndTypeAndDateBetween(
                user,
                TransactionType.INCOME,
                request.getFromDate(),
                request.getToDate()
        );

        BigDecimal totalExpense = financialTransactionRepository.sumAmountByUserAndTypeAndDateBetween(
                user,
                TransactionType.EXPENSE,
                request.getFromDate(),
                request.getToDate()
        );

        Long transactionCount = financialTransactionRepository.countByUserAndDateBetween(
                user,
                request.getFromDate(),
                request.getToDate()
        );

        List<CategorySummaryResponse> categorySummaries = financialTransactionRepository.getCategorySummaries(
                user,
                request.getFromDate(),
                request.getToDate()
        );

        BigDecimal balance = totalIncome.subtract(totalExpense);

        return new DashboardSummaryResponse(
                user.getId(),
                request.getFromDate(),
                request.getToDate(),
                totalIncome,
                totalExpense,
                balance,
                transactionCount,
                categorySummaries
        );
    }

    public DashboardSummaryResponse getCurrentMonthSummary() {
        LocalDate now = LocalDate.now();
        LocalDate firstDayOfMonth = now.withDayOfMonth(1);
        LocalDate lastDayOfMonth = now.withDayOfMonth(now.lengthOfMonth());

        DashboardSummaryRequest request = new DashboardSummaryRequest();
        request.setFromDate(firstDayOfMonth);
        request.setToDate(lastDayOfMonth);

        return getSummary(request);
    }
}
