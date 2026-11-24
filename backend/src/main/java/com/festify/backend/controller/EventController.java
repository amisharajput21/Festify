
package com.festify.backend.controller;

import com.festify.backend.entity.Event;
import com.festify.backend.entity.EventStatus;
import com.festify.backend.repository.EventRepository;
import com.festify.backend.repository.TicketCategoryRepository;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.math.BigDecimal;
import java.util.List;

@RestController
@RequestMapping("/api/v1/events")
@CrossOrigin(origins = {
    "http://localhost:3000",
    "http://localhost:3001",
    "http://localhost:5173"
})
public class EventController {

    private final EventRepository eventRepository;
    private final TicketCategoryRepository ticketCategoryRepository;

    public EventController(
            EventRepository eventRepository,
            TicketCategoryRepository ticketCategoryRepository) {
        this.eventRepository = eventRepository;
        this.ticketCategoryRepository = ticketCategoryRepository;
    }

    // Only approved events are visible publicly
    @GetMapping
    public List<Event> getAllEvents() {
        return eventRepository.findByStatus(EventStatus.APPROVED);
    }

    // Only approved event details are publicly accessible
    @GetMapping("/{id}")
    public Event getEventById(@PathVariable Long id) {
        return eventRepository.findByIdAndStatus(id, EventStatus.APPROVED)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND, "Event not found"));
    }

    // Ticket categories are available only for approved events
    @GetMapping("/{eventId}/ticket-categories")
    public List<TicketCategoryResponse> getTicketCategories(
            @PathVariable Long eventId) {

        eventRepository.findByIdAndStatus(eventId, EventStatus.APPROVED)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND, "Event not found"));

        return ticketCategoryRepository.findByEventId(eventId)
                .stream()
                .map(category -> new TicketCategoryResponse(
                        category.getId(),
                        category.getName(),
                        category.getDescription(),
                        category.getPrice(),
                        category.getTotalSeats(),
                        category.getAvailableSeats()
                ))
                .toList();
    }

    public record TicketCategoryResponse(
            Long id,
            String name,
            String description,
            BigDecimal price,
            Integer totalSeats,
            Integer availableSeats
    ) {}
}
