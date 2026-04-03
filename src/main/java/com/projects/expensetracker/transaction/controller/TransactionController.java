package com.projects.expensetracker.transaction.controller;

import com.projects.expensetracker.transaction.dto.TransactionCreateRequest;
import com.projects.expensetracker.transaction.dto.TransactionFilterRequest;
import com.projects.expensetracker.transaction.dto.TransactionResponse;
import com.projects.expensetracker.transaction.dto.TransactionUpdateRequest;
import com.projects.expensetracker.transaction.service.TransactionService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;

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
    public List<TransactionResponse> getTransactionsByUserId(@RequestParam Long userId) {
        return transactionService.getTransactionsByUserId(userId);
    }

    @GetMapping("/filter")
    public List<TransactionResponse> filterTransactions(@ModelAttribute TransactionFilterRequest filter) {
        return transactionService.filterTransactions(filter);
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