
package com.festify.backend.service;

import com.festify.backend.entity.OrganizerApplication;
import com.festify.backend.entity.User;
import com.festify.backend.repository.OrganizerApplicationRepository;
import com.festify.backend.repository.UserRepository;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class OrganizerApplicationService {

    private final OrganizerApplicationRepository applicationRepository;
    private final UserRepository userRepository;

    public OrganizerApplicationService(
            OrganizerApplicationRepository applicationRepository,
            UserRepository userRepository) {
        this.applicationRepository = applicationRepository;
        this.userRepository = userRepository;
    }

    @Transactional
    public OrganizerApplication submitApplication(
            String email, String reason) {

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        if ("ROLE_ADMIN".equals(user.getRole())
                || "ROLE_ORGANIZER".equals(user.getRole())) {
            throw new RuntimeException(
                    "You already have organizer or admin access");
        }

        if (applicationRepository.existsByUserIdAndStatus(
                user.getId(), "PENDING")) {
            throw new RuntimeException(
                    "You already have a pending application");
        }

        OrganizerApplication application = new OrganizerApplication();
        application.setUser(user);
        application.setReason(reason);
        application.setStatus("PENDING");

        return applicationRepository.save(application);
    }

    public List<OrganizerApplication> getPendingApplications() {
        return applicationRepository
                .findByStatusOrderByCreatedAtDesc("PENDING");
    }

    @Transactional
    public OrganizerApplication reviewApplication(
            Long applicationId, String decision, String adminComment) {

        OrganizerApplication application =
                applicationRepository.findById(applicationId)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Application not found"));

        if (!"PENDING".equals(application.getStatus())) {
            throw new RuntimeException(
                    "Application has already been reviewed");
        }

        if (!"APPROVED".equals(decision)
                && !"REJECTED".equals(decision)) {
            throw new RuntimeException("Invalid decision");
        }

        if ("APPROVED".equals(decision)) {
            User user = application.getUser();
            user.setRole("ROLE_ORGANIZER");
            userRepository.save(user);
        }

        application.setStatus(decision);
        application.setAdminComment(adminComment);
        application.setReviewedAt(LocalDateTime.now());

        return applicationRepository.save(application);
    }
}
