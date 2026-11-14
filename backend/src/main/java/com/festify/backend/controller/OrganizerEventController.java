
package com.festify.backend.controller;

import com.festify.backend.entity.Event;
import com.festify.backend.entity.User;
import com.festify.backend.repository.EventRepository;
import com.festify.backend.repository.UserRepository;

import org.springframework.http.HttpStatus;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@RestController
@RequestMapping("/api/v1/organizer/events")
@PreAuthorize("hasAuthority('ROLE_ORGANIZER')")
@CrossOrigin(origins = {
    "http://localhost:3000",
    "http://localhost:3001",
    "http://localhost:5173"
})
public class OrganizerEventController {

    private final EventRepository eventRepository;
    private final UserRepository userRepository;

    public OrganizerEventController(
            EventRepository eventRepository,
            UserRepository userRepository) {
        this.eventRepository = eventRepository;
        this.userRepository = userRepository;
    }

    private User getOrganizer(Jwt jwt) {
        User user = userRepository.findByEmail(jwt.getSubject())
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND, "Organizer not found"));

        if (!"ROLE_ORGANIZER".equals(user.getRole())) {
            throw new ResponseStatusException(
                    HttpStatus.FORBIDDEN, "Organizer access required");
        }

        return user;
    }

    @GetMapping
    public List<Event> getMyEvents(@AuthenticationPrincipal Jwt jwt) {
        User organizer = getOrganizer(jwt);
        return eventRepository.findByOrganizer_Id(organizer.getId());
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public Event createEvent(
            @RequestBody Event request,
            @AuthenticationPrincipal Jwt jwt) {

        User organizer = getOrganizer(jwt);

        Event event = new Event();
        copyEventDetails(request, event);
        event.setOrganizer(organizer);

        return eventRepository.save(event);
    }

    @PutMapping("/{id}")
    @Transactional
    public Event updateEvent(
            @PathVariable Long id,
            @RequestBody Event request,
            @AuthenticationPrincipal Jwt jwt) {

        User organizer = getOrganizer(jwt);

        Event event = eventRepository
                .findByIdAndOrganizer_Id(id, organizer.getId())
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND, "Your event not found"));

        copyEventDetails(request, event);

        return eventRepository.save(event);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deleteEvent(
            @PathVariable Long id,
            @AuthenticationPrincipal Jwt jwt) {

        User organizer = getOrganizer(jwt);

        Event event = eventRepository
                .findByIdAndOrganizer_Id(id, organizer.getId())
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND, "Your event not found"));

        eventRepository.delete(event);
    }

    private void copyEventDetails(Event source, Event target) {
        target.setTitle(source.getTitle());
        target.setDescription(source.getDescription());
        target.setCategory(source.getCategory());
        target.setCity(source.getCity());
        target.setVenue(source.getVenue());
        target.setEventDate(source.getEventDate());
        target.setStartingPrice(source.getStartingPrice());
        target.setImageUrl(source.getImageUrl());
        target.setFeatured(source.isFeatured());
    }
}
