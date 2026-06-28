package com.treasury.treasury.service;

import com.treasury.treasury.dto.CreateClaimRequest;
import com.treasury.treasury.model.*;
import com.treasury.treasury.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.time.Year;
import java.util.List;
import java.util.Set;

@Service
@RequiredArgsConstructor
public class ClaimService {

    private static final Set<Integer> VAT_RATES = Set.of(0, 10, 20);

    private final ClaimRepository claimRepo;
    private final ContractorRepository contractorRepo;
    private final AccountRepository accountRepo;
    private final AttachmentService attachmentService;
    private final NotificationService notificationService;

    @Transactional
    public Claim create(User initiator, CreateClaimRequest req, List<MultipartFile> files)
            throws IOException {
        if (initiator.getRole() != User.Role.USER) {
            throw new RuntimeException("Создавать заявки может только пользователь");
        }
        if (!VAT_RATES.contains(req.getVatRate())) {
            throw new RuntimeException("Ставка НДС должна быть 0, 10 или 20");
        }
        Contractor contractor = contractorRepo.findById(req.getContractorId())
                .orElseThrow(() -> new RuntimeException("Контрагент не найден"));

        String number = String.format("%d-%06d",
                Year.now().getValue(), claimRepo.count() + 1);

        Claim claim = Claim.builder()
                .claimNumber(number)
                .user(initiator)
                .contractor(contractor)
                .amount(req.getAmount())
                .vatRate(req.getVatRate())
                .description(req.getDescription())
                .status(Claim.Status.PENDING_APPROVAL)
                .build();
        claim = claimRepo.save(claim);

        if (files != null) {
            for (MultipartFile f : files) {
                if (!f.isEmpty()) attachmentService.save(claim, f);
            }
        }

        notificationService.create(initiator,
                "Заявка №" + number + " отправлена на согласование",
                "/claims");
        // (поиск директора и уведомление ему — отдельной задачей,
        //  пока директор сам увидит в списке)
        return claim;
    }

    public List<Claim> listFor(User user) {
        return switch (user.getRole()) {
            case USER         -> claimRepo.findByUserOrderByCreatedAtDesc(user);
            case DIRECTOR, FIN_MANAGER -> claimRepo.findAllByOrderByCreatedAtDesc();
        };
    }

    public Claim getFor(User user, Long id) {
        Claim c = claimRepo.findById(id)
                .orElseThrow(() -> new RuntimeException("Заявка не найдена"));
        if (user.getRole() == User.Role.USER && !c.getUser().getId().equals(user.getId())) {
            throw new RuntimeException("Нет доступа к заявке");
        }
        return c;
    }

    @Transactional
    public Claim approve(User director, Long claimId) {
        if (director.getRole() != User.Role.DIRECTOR)
            throw new RuntimeException("Только директор может согласовывать");
        Claim c = claimRepo.findById(claimId)
                .orElseThrow(() -> new RuntimeException("Заявка не найдена"));
        if (c.getStatus() != Claim.Status.PENDING_APPROVAL)
            throw new RuntimeException("Заявка не в статусе ожидания");
        c.setStatus(Claim.Status.PENDING_PAYMENT);
        c.setApprovedBy(director.getLogin());
        c.setApprovedAt(java.time.LocalDateTime.now());
        notificationService.create(c.getUser(),
                "Заявка №" + c.getClaimNumber() + " одобрена директором",
                "/claims");
        return claimRepo.save(c);
    }

    @Transactional
    public Claim reject(User actor, Long claimId, String reason) {
        Claim c = claimRepo.findById(claimId)
                .orElseThrow(() -> new RuntimeException("Заявка не найдена"));
        boolean isDirector   = actor.getRole() == User.Role.DIRECTOR
                && c.getStatus() == Claim.Status.PENDING_APPROVAL;
        boolean isFinManager = actor.getRole() == User.Role.FIN_MANAGER
                && c.getStatus() == Claim.Status.PENDING_PAYMENT;
        if (!isDirector && !isFinManager)
            throw new RuntimeException("Нет прав на отклонение в текущем статусе");
        if (reason == null || reason.isBlank())
            throw new RuntimeException("Укажите причину отклонения");

        c.setStatus(Claim.Status.REJECTED);
        c.setRejectionReason(reason);
        if (isDirector) {
            c.setApprovedBy(actor.getLogin());
            c.setApprovedAt(java.time.LocalDateTime.now());
        } else {
            c.setPaidBy(actor.getLogin());
            c.setPaidAt(java.time.LocalDateTime.now());
        }
        notificationService.create(c.getUser(),
                "Заявка №" + c.getClaimNumber() + " отклонена: " + reason,
                "/claims");
        return claimRepo.save(c);
    }

    @Transactional
    public Claim setAccountAndPay(User fin, Long claimId, Long accountId) {
        if (fin.getRole() != User.Role.FIN_MANAGER)
            throw new RuntimeException("Только фин. менеджер");
        Claim c = claimRepo.findById(claimId)
                .orElseThrow(() -> new RuntimeException("Заявка не найдена"));
        if (c.getStatus() != Claim.Status.PENDING_PAYMENT)
            throw new RuntimeException("Заявка не ожидает оплаты");
        Account a = accountRepo.findById(accountId)
                .orElseThrow(() -> new RuntimeException("Счёт не найден"));
        if (a.getBalance().compareTo(c.getAmount()) < 0)
            throw new RuntimeException("Недостаточно средств на счёте");

        a.setBalance(a.getBalance().subtract(c.getAmount()));
        accountRepo.save(a);

        c.setAccount(a);
        c.setStatus(Claim.Status.PAID);
        c.setPaidBy(fin.getLogin());
        c.setPaidAt(java.time.LocalDateTime.now());
        notificationService.create(c.getUser(),
                "Заявка №" + c.getClaimNumber() + " оплачена",
                "/claims");
        return claimRepo.save(c);
    }
}