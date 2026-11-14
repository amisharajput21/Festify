
package com.festify.backend.controller;

import com.festify.backend.entity.OrganizerApplication;
import com.festify.backend.service.OrganizerApplicationService;

import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/api/v1/organizer-applications")
@PreAuthorize("hasAuthority('ROLE_ADMIN')")
@CrossOrigin(origins = {
    "http://localhost:3000",
    "http://localhost:3001",
    "http://localhost:5173"
})
public class OrganizerApplicationController {

    private final OrganizerApplicationService applicationService;

    public OrganizerApplicationController(
            OrganizerApplicationService applicationService) {
        this.applicationService = applicationService;
    }

    @GetMapping("/admin/pending")
    public List<ApplicationResponse> getPendingApplications() {
        return applicationService.getPendingApplications()
                .stream()
                .map(this::toResponse)
                .toList();
    }

    @PutMapping("/admin/{id}/review")
    public ApplicationResponse reviewApplication(
            @PathVariable Long id,
            @RequestBody ReviewRequest request) {

        OrganizerApplication application =
                applicationService.reviewApplication(
                        id,
                        request.decision(),
                        request.adminComment()
                );

        return toResponse(application);
    }

    private ApplicationResponse toResponse(
            OrganizerApplication application) {

        return new ApplicationResponse(
                application.getId(),
                application.getUser().getId(),
                application.getUser().getName(),
                application.getUser().getEmail(),
                application.getReason(),
                application.getStatus(),
                application.getCreatedAt(),
                application.getReviewedAt(),
                application.getAdminComment()
        );
    }

    public record ReviewRequest(
            String decision,
            String adminComment
    ) {}

    public record ApplicationResponse(
            Long id,
            Long userId,
            String userName,
            String userEmail,
            String reason,
            String status,
            LocalDateTime createdAt,
            LocalDateTime reviewedAt,
            String adminComment
    ) {}
}
