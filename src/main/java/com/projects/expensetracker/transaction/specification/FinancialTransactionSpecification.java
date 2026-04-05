package com.projects.expensetracker.transaction.specification;

import com.projects.expensetracker.transaction.dto.TransactionFilterRequest;
import com.projects.expensetracker.transaction.entity.FinancialTransaction;
import com.projects.expensetracker.user.entity.AppUser;
import jakarta.persistence.criteria.Predicate;
import org.springframework.data.jpa.domain.Specification;

import java.util.ArrayList;
import java.util.List;

public class FinancialTransactionSpecification {

    private FinancialTransactionSpecification() {
    }

    public static Specification<FinancialTransaction> withFilters(AppUser user, TransactionFilterRequest filter) {
        return (root, query, criteriaBuilder) -> {
            List<Predicate> predicates = new ArrayList<>();

            predicates.add(criteriaBuilder.equal(root.get("user"), user));

            if (filter.getFromDate() != null) {
                predicates.add(criteriaBuilder.greaterThanOrEqualTo(root.get("date"), filter.getFromDate()));
            }

            if (filter.getToDate() != null) {
                predicates.add(criteriaBuilder.lessThanOrEqualTo(root.get("date"), filter.getToDate()));
            }

            if (filter.getType() != null) {
                predicates.add(criteriaBuilder.equal(root.get("type"), filter.getType()));
            }

            if (filter.getCategoryId() != null) {
                predicates.add(criteriaBuilder.equal(root.get("category").get("id"), filter.getCategoryId()));
            }

            return criteriaBuilder.and(predicates.toArray(new Predicate[0]));
        };
    }
}
