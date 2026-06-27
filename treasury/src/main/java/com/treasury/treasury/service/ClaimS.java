package com.treasury.treasury.service;

import com.treasury.treasury.dto.ClaimResponse;
import com.treasury.treasury.dto.CreateClaimRequest;
import com.treasury.treasury.model.*;
import com.treasury.treasury.repository.ClaimRepos;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ClaimS {

    private final ClaimRepos claimRepository;
    private final ContractorS contractorService;
    private final SetAccountS accountService;
    private final NotificationService notificationService;

    public List<ClaimResponse> getAll() {
        return claimRepository.findAllOrderByCreatedAtDesc().stream()
                .map(ClaimResponse::from)
                .collect(Collectors.toList());
    }

    public List<ClaimResponse> getByUserId(Long userId) {
        return claimRepository.findAllByUserIdOrderByCreatedAtDesc(userId).stream()
                .map(ClaimResponse::from)
                .collect(Collectors.toList());
    }

    public ClaimResponse getById(Long id) {
        return claimRepository.findById(id)
                .map(ClaimResponse::from)
                .orElseThrow(() -> new RuntimeException("Заявка не найдена"));
    }

    @Transactional
    public ClaimResponse create(CreateClaimRequest request, User user) {
        Contractor contractor = contractorService.findById(request.getContractorId());
        Account account = accountService.findById(request.getAccountId());

        Claim claim = Claim.builder()
                .description(request.getDescription())
                .amount(request.getAmount())
                .status(Claim.Status.PENDING_APPROVAL)
                .user(user)
                .contractor(contractor)
                .account(account)
                .build();

        claim = claimRepository.save(claim);

        notificationService.create(
                user,
                "Создана новая заявка на оплату: " + request.getDescription(),
                "/claims/" + claim.getId() + "/approval"
        );

        return ClaimResponse.from(claim);
    }

    @Transactional
    public ClaimResponse approve(Long id, User approver) {
        Claim claim = claimRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Заявка не найдена"));

        if (claim.getStatus() != Claim.Status.PENDING_APPROVAL) {
            throw new RuntimeException("Заявка не может быть одобрена в текущем статусе: " + claim.getStatus());
        }

        claim.setStatus(Claim.Status.PENDING_PAYMENT);
        claim.setApprovedAt(LocalDateTime.now());
        claim.setApprovedBy(approver.getLogin());

        claim = claimRepository.save(claim);

        notificationService.create(
                claim.getUser(),
                "Ваша заявка одобрена: " + claim.getDescription(),
                "/claims/" + claim.getId() + "/payment"
        );

        return ClaimResponse.from(claim);
    }

    @Transactional
    public ClaimResponse reject(Long id, User approver, String reason) {
        Claim claim = claimRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Заявка не найдена"));

        if (claim.getStatus() != Claim.Status.PENDING_APPROVAL) {
            throw new RuntimeException("Заявка не может быть отклонена в текущем статусе: " + claim.getStatus());
        }

        claim.setStatus(Claim.Status.REJECTED);
        claim.setApprovedAt(LocalDateTime.now());
        claim.setApprovedBy(approver.getLogin());
        claim.setRejectionReason(reason);

        claim = claimRepository.save(claim);

        notificationService.create(
                claim.getUser(),
                "Ваша заявка отклонена: " + claim.getDescription() + ". Причина: " + reason,
                "/claims/" + claim.getId()
        );

        return ClaimResponse.from(claim);
    }

    @Transactional
    public ClaimResponse pay(Long id, User paymentManager) {
        Claim claim = claimRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Заявка не найдена"));

        if (claim.getStatus() != Claim.Status.PENDING_PAYMENT) {
            throw new RuntimeException("Заявка не может быть оплачена в текущем статусе: " + claim.getStatus());
        }

        // Проверяем баланс
        Account account = claim.getAccount();
        if (account.getBalance().compareTo(claim.getAmount()) < 0) {
            throw new RuntimeException("Недостаточно средств на счёте. Баланс: " + account.getBalance() + ", требуется: " + claim.getAmount());
        }

        // Списываем со счёта
        account.setBalance(account.getBalance().subtract(claim.getAmount()));

        claim.setStatus(Claim.Status.PAID);
        claim.setPaidAt(LocalDateTime.now());
        claim.setPaidBy(paymentManager.getLogin());

        claim = claimRepository.save(claim);

        notificationService.create(
                claim.getUser(),
                "Заявка оплачена: " + claim.getDescription(),
                "/claims/" + claim.getId()
        );

        return ClaimResponse.from(claim);
    }
}