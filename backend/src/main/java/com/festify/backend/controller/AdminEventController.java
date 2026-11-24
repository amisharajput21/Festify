package com.festify.backend.controller;

import com.festify.backend.entity.Event;
import com.festify.backend.entity.EventStatus;
import com.festify.backend.repository.EventRepository;

import org.springframework.http.HttpStatus;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@RestController
@RequestMapping("/api/v1/admin/events")
@PreAuthorize("hasAuthority('ROLE_ADMIN')")
public class AdminEventController {

    private final EventRepository eventRepository;

    public AdminEventController(EventRepository eventRepository) {
        this.eventRepository = eventRepository;
    }

    // Get all pending events
    @GetMapping("/pending")
    public List<Event> getPendingEvents() {
        return eventRepository.findByStatus(EventStatus.PENDING);
    }

    // Approve only pending events
    @PutMapping("/{id}/approve")
    public Event approveEvent(@PathVariable Long id) {
        Event event = eventRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND, "Event not found"));

        if (event.getStatus() != EventStatus.PENDING) {
            throw new ResponseStatusException(
                    HttpStatus.CONFLICT,
                    "Only pending events can be approved");
        }

        event.setStatus(EventStatus.APPROVED);
        return eventRepository.save(event);
    }

    // Reject only pending events
    @PutMapping("/{id}/reject")
    public Event rejectEvent(@PathVariable Long id) {
        Event event = eventRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND, "Event not found"));

        if (event.getStatus() != EventStatus.PENDING) {
            throw new ResponseStatusException(
                    HttpStatus.CONFLICT,
                    "Only pending events can be rejected");
        }

        event.setStatus(EventStatus.REJECTED);
        return eventRepository.save(event);
    }
}