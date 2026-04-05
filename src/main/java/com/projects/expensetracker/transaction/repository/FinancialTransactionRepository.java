package com.projects.expensetracker.transaction.repository;

import com.projects.expensetracker.dashboard.dto.CategorySummaryResponse;
import com.projects.expensetracker.transaction.entity.FinancialTransaction;
import com.projects.expensetracker.transaction.entity.TransactionType;
import com.projects.expensetracker.user.entity.AppUser;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

public interface FinancialTransactionRepository
        extends JpaRepository<FinancialTransaction, Long>, JpaSpecificationExecutor<FinancialTransaction> {

    List<FinancialTransaction> findByUser(AppUser user);

    List<FinancialTransaction> findByUserAndDateBetween(AppUser user, LocalDate startDate, LocalDate endDate);

    Optional<FinancialTransaction> findByIdAndUser(Long id, AppUser user);

    boolean existsByCategory(com.projects.expensetracker.category.entity.Category category);

    @Query("""
            select coalesce(sum(ft.amount), 0)
            from FinancialTransaction ft
            where ft.user = :user
              and ft.type = :type
              and ft.date between :fromDate and :toDate
            """)
    BigDecimal sumAmountByUserAndTypeAndDateBetween(AppUser user,
                                                    TransactionType type,
                                                    LocalDate fromDate,
                                                    LocalDate toDate);

    @Query("""
            select count(ft)
            from FinancialTransaction ft
            where ft.user = :user
              and ft.date between :fromDate and :toDate
            """)
    Long countByUserAndDateBetween(AppUser user, LocalDate fromDate, LocalDate toDate);

    @Query("""
        select new com.projects.expensetracker.dashboard.dto.CategorySummaryResponse(
            ft.category.id,
            ft.category.name,
            ft.category.type,
            coalesce(sum(ft.amount), 0E0),
            count(ft)
        )
        from FinancialTransaction ft
        where ft.user = :user
          and ft.date between :fromDate and :toDate
        group by ft.category.id, ft.category.name, ft.category.type
        order by coalesce(sum(ft.amount), 0E0) desc
        """)
    List<CategorySummaryResponse> getCategorySummaries(AppUser user, LocalDate fromDate, LocalDate toDate);
}
