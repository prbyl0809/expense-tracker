package com.projects.expensetracker.transaction.repository;

import com.projects.expensetracker.transaction.entity.FinancialTransaction;
import com.projects.expensetracker.user.entity.AppUser;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

import java.time.LocalDate;
import java.util.List;

public interface FinancialTransactionRepository
        extends JpaRepository<FinancialTransaction, Long>, JpaSpecificationExecutor<FinancialTransaction> {

    List<FinancialTransaction> findByUser(AppUser user);

    List<FinancialTransaction> findByUserAndDateBetween(AppUser user, LocalDate startDate, LocalDate endDate);
}