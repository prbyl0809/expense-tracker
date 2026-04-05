package com.projects.expensetracker;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.projects.expensetracker.category.entity.Category;
import com.projects.expensetracker.category.repository.CategoryRepository;
import com.projects.expensetracker.security.JwtService;
import com.projects.expensetracker.transaction.entity.FinancialTransaction;
import com.projects.expensetracker.transaction.entity.TransactionType;
import com.projects.expensetracker.transaction.repository.FinancialTransactionRepository;
import com.projects.expensetracker.user.entity.AppUser;
import com.projects.expensetracker.user.repository.AppUserRepository;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.webmvc.test.autoconfigure.AutoConfigureMockMvc;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MvcResult;

import java.math.BigDecimal;
import java.time.LocalDate;

@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
public abstract class AbstractIntegrationTest {

    protected final ObjectMapper objectMapper = new ObjectMapper().findAndRegisterModules();

    @Autowired
    protected org.springframework.test.web.servlet.MockMvc mockMvc;

    @Autowired
    protected AppUserRepository appUserRepository;

    @Autowired
    protected CategoryRepository categoryRepository;

    @Autowired
    protected FinancialTransactionRepository financialTransactionRepository;

    @Autowired
    protected PasswordEncoder passwordEncoder;

    @Autowired
    protected JwtService jwtService;

    @org.junit.jupiter.api.BeforeEach
    void cleanDatabase() {
        financialTransactionRepository.deleteAll();
        categoryRepository.deleteAll();
        appUserRepository.deleteAll();
    }

    protected String toJson(Object value) throws Exception {
        return objectMapper.writeValueAsString(value);
    }

    protected JsonNode readJson(MvcResult result) throws Exception {
        return objectMapper.readTree(result.getResponse().getContentAsString());
    }

    protected AppUser createUser(String email, String rawPassword, String displayName) {
        AppUser user = new AppUser();
        user.setEmail(email);
        user.setPasswordHash(passwordEncoder.encode(rawPassword));
        user.setDisplayName(displayName);
        return appUserRepository.save(user);
    }

    protected String tokenFor(AppUser user) {
        return jwtService.generateToken(user.getEmail());
    }

    protected Category createCategory(AppUser user, String name, TransactionType type) {
        Category category = new Category();
        category.setName(name);
        category.setType(type);
        category.setUser(user);
        return categoryRepository.save(category);
    }

    protected FinancialTransaction createTransaction(AppUser user,
                                                     Category category,
                                                     TransactionType type,
                                                     BigDecimal amount,
                                                     LocalDate date,
                                                     String description) {
        FinancialTransaction transaction = new FinancialTransaction();
        transaction.setUser(user);
        transaction.setCategory(category);
        transaction.setType(type);
        transaction.setAmount(amount);
        transaction.setDate(date);
        transaction.setDescription(description);
        return financialTransactionRepository.save(transaction);
    }
}
