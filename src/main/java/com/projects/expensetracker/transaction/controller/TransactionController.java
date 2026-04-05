package com.projects.expensetracker.transaction.controller;

import com.projects.expensetracker.common.dto.PagedResponse;
import com.projects.expensetracker.transaction.dto.TransactionCreateRequest;
import com.projects.expensetracker.transaction.dto.TransactionFilterRequest;
import com.projects.expensetracker.transaction.dto.TransactionResponse;
import com.projects.expensetracker.transaction.dto.TransactionUpdateRequest;
import com.projects.expensetracker.transaction.service.TransactionService;
import jakarta.validation.Valid;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/transactions")
public class TransactionController {

    private final TransactionService transactionService;

    public TransactionController(TransactionService transactionService) {
        this.transactionService = transactionService;
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public TransactionResponse createTransaction(@Valid @RequestBody TransactionCreateRequest request) {
        return transactionService.createTransaction(request);
    }

    @GetMapping
    public PagedResponse<TransactionResponse> getTransactions(
            @PageableDefault(size = 20, sort = {"date", "id"}, direction = org.springframework.data.domain.Sort.Direction.DESC)
            Pageable pageable) {
        return transactionService.getTransactions(pageable);
    }

    @GetMapping("/filter")
    public PagedResponse<TransactionResponse> filterTransactions(
            @ModelAttribute TransactionFilterRequest filter,
            @PageableDefault(size = 20, sort = {"date", "id"}, direction = org.springframework.data.domain.Sort.Direction.DESC)
            Pageable pageable) {
        return transactionService.filterTransactions(filter, pageable);
    }

    @GetMapping("/{transactionId}")
    public TransactionResponse getTransactionById(@PathVariable Long transactionId) {
        return transactionService.getTransactionById(transactionId);
    }

    @PutMapping("/{transactionId}")
    public TransactionResponse updateTransaction(@PathVariable Long transactionId,
                                                 @Valid @RequestBody TransactionUpdateRequest request) {
        return transactionService.updateTransaction(transactionId, request);
    }

    @DeleteMapping("/{transactionId}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deleteTransaction(@PathVariable Long transactionId) {
        transactionService.deleteTransaction(transactionId);
    }
}
