
package com.festify.backend.controller;

import com.festify.backend.entity.Event;
import com.festify.backend.entity.TicketCategory;
import com.festify.backend.repository.EventRepository;
import com.festify.backend.repository.TicketCategoryRepository;

import org.springframework.web.bind.annotation.*;

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

    @GetMapping
    public List<Event> getAllEvents() {
        return eventRepository.findAll();
    }

    @GetMapping("/{id}")
    public Event getEventById(@PathVariable Long id) {
        return eventRepository.findById(id).orElse(null);
    }

    @GetMapping("/{eventId}/ticket-categories")
    public List<TicketCategoryResponse> getTicketCategories(
            @PathVariable Long eventId) {

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

    @PostMapping
    public Event createEvent(@RequestBody Event event) {
        return eventRepository.save(event);
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
