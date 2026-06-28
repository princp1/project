package com.treasury.treasury;

import com.treasury.treasury.model.*;
import com.treasury.treasury.repository.*;
import jakarta.annotation.PostConstruct;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.Optional;

@Component
@RequiredArgsConstructor
public class DataSeeder {

    private final UserRepos userRepo;
    private final DepartmentRepository departmentRepo;
    private final ContractorRepository contractorRepo;
    private final AccountRepository accountRepo;
    private final PasswordEncoder encoder;

    @PostConstruct
    @Transactional
    public void seed() {
        // Проверяем, есть ли уже пользователи в БД
        if (userRepo.count() > 0) {
            System.out.println("ℹ️ Данные уже существуют, пропускаем инициализацию.");
            return;
        }

        System.out.println("🌱 Начинаем инициализацию данных...");

        // ===== ДЕПАРТАМЕНТЫ =====
        Department marketing = getOrCreateDepartment("Маркетинг");
        Department office = getOrCreateDepartment("Канцелярия");
        Department sysadmin = getOrCreateDepartment("Системные администраторы");

        // ===== ПОЛЬЗОВАТЕЛИ =====
        userRepo.save(User.builder()
                .login("user")
                .password(encoder.encode("password"))
                .fullName("Иванов Иван")
                .role(User.Role.USER)
                .department(marketing)
                .build());

        userRepo.save(User.builder()
                .login("director")
                .password(encoder.encode("password"))
                .fullName("Петров Пётр")
                .role(User.Role.DIRECTOR)
                .build());

        userRepo.save(User.builder()
                .login("fin")
                .password(encoder.encode("password"))
                .fullName("Сидорова Анна")
                .role(User.Role.FIN_MANAGER)
                .build());

        // ===== КОНТРАГЕНТЫ =====
        getOrCreateContractor(
                "ООО \"Маркет\"",
                "Общество с ограниченной ответственностью \"Маркет\"",
                "1234567890",
                "123456789",
                "40702810000000000001"
        );

        getOrCreateContractor(
                "ООО \"Плюс\"",
                "Общество с ограниченной ответственностью \"Плюс\"",
                "2345678901",
                "234567890",
                "40702810000000000002"
        );

        // ===== СЧЕТА =====
        getOrCreateAccount(
                "Основной расчётный",
                "40702810099910004312",
                "RUB",
                new BigDecimal("1500000.00"),
                "Сбербанк"
        );

        getOrCreateAccount(
                "Резервный",
                "40702810500000001234",
                "RUB",
                new BigDecimal("850000.00"),
                "ВТБ"
        );

        System.out.println("✅ Инициализация данных успешно завершена!");
    }

    // ===== ВСПОМОГАТЕЛЬНЫЕ МЕТОДЫ С ПРОВЕРКОЙ =====

    private Department getOrCreateDepartment(String name) {
        Optional<Department> existing = departmentRepo.findByName(name);
        if (existing.isPresent()) {
            return existing.get();
        }
        return departmentRepo.save(Department.builder().name(name).build());
    }

    private void getOrCreateContractor(String name, String fullName, String inn, String kpp, String bankAccount) {
        // Проверяем по ИНН или названию
        if (contractorRepo.findByInn(inn).isPresent()) {
            System.out.println("ℹ️ Контрагент с ИНН " + inn + " уже существует, пропускаем.");
            return;
        }
        contractorRepo.save(Contractor.builder()
                .name(name)
                .fullName(fullName)
                .inn(inn)
                .kpp(kpp)
                .bankAccount(bankAccount)
                .build());
    }

    private void getOrCreateAccount(String name, String accountNumber, String currency, BigDecimal balance, String bank) {
        // Проверяем по номеру счета
        if (accountRepo.findByAccountNumber(accountNumber).isPresent()) {
            System.out.println("ℹ️ Счет " + accountNumber + " уже существует, пропускаем.");
            return;
        }
        accountRepo.save(Account.builder()
                .name(name)
                .accountNumber(accountNumber)
                .currency(currency)
                .balance(balance)
                .bank(bank)
                .build());
    }
}