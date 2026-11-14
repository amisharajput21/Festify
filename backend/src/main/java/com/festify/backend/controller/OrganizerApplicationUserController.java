
package com.festify.backend.controller;

import com.festify.backend.entity.OrganizerApplication;
import com.festify.backend.service.OrganizerApplicationService;

import org.springframework.http.HttpStatus;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.util.Map;

@RestController
@RequestMapping("/api/v1/organizer-applications")
@PreAuthorize("hasAuthority('ROLE_USER')")
@CrossOrigin(origins = {
    "http://localhost:3000",
    "http://localhost:3001",
    "http://localhost:5173"
})
public class OrganizerApplicationUserController {

    private final OrganizerApplicationService applicationService;

    public OrganizerApplicationUserController(
            OrganizerApplicationService applicationService) {
        this.applicationService = applicationService;
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public Map<String, Object> submitApplication(
            @RequestBody ApplicationRequest request,
            @AuthenticationPrincipal Jwt jwt) {

        if (request.reason() == null || request.reason().isBlank()) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "Application reason is required");
        }

        if (request.reason().length() > 1000) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "Application reason cannot exceed 1000 characters");
        }

        OrganizerApplication application =
                applicationService.submitApplication(
                        jwt.getSubject(),
                        request.reason().trim()
                );

        return Map.of(
                "id", application.getId(),
                "status", application.getStatus(),
                "message", "Organizer application submitted successfully"
        );
    }

    public record ApplicationRequest(String reason) {}
}
