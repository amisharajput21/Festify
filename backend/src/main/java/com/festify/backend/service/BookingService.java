
package com.festify.backend.service;

import com.festify.backend.dto.BookingRequest;
import com.festify.backend.dto.BookingResponse;
import com.festify.backend.entity.Booking;
import com.festify.backend.entity.Event;
import com.festify.backend.entity.TicketCategory;
import com.festify.backend.entity.User;
import com.festify.backend.repository.BookingRepository;
import com.festify.backend.repository.EventRepository;
import com.festify.backend.repository.TicketCategoryRepository;
import com.festify.backend.repository.UserRepository;

import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.List;

@Service
public class BookingService {

    private final BookingRepository bookingRepository;
    private final EventRepository eventRepository;
    private final TicketCategoryRepository ticketCategoryRepository;
    private final UserRepository userRepository;

    public BookingService(
            BookingRepository bookingRepository,
            EventRepository eventRepository,
            TicketCategoryRepository ticketCategoryRepository,
            UserRepository userRepository) {

        this.bookingRepository = bookingRepository;
        this.eventRepository = eventRepository;
        this.ticketCategoryRepository = ticketCategoryRepository;
        this.userRepository = userRepository;
    }

    @Transactional
    public BookingResponse createBooking(BookingRequest request) {

        Event event = eventRepository.findById(request.getEventId())
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND, "Event not found"));

        TicketCategory category = ticketCategoryRepository
                .findByIdForUpdate(request.getTicketCategoryId())
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND, "Ticket category not found"));

        if (!category.getEvent().getId().equals(event.getId())) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "Ticket category does not belong to this event");
        }

        if (request.getQuantity() == null || request.getQuantity() < 1) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST, "Invalid ticket quantity");
        }

        if (category.getAvailableSeats() < request.getQuantity()) {
            throw new ResponseStatusException(
                    HttpStatus.CONFLICT, "Not enough tickets available");
        }

        User user = userRepository.findByEmail(
                request.getAttendeeEmail().trim())
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND, "Please create an account first"));

        BigDecimal unitPrice = category.getPrice();

        BigDecimal subtotal = unitPrice.multiply(
                BigDecimal.valueOf(request.getQuantity()));

        BigDecimal bookingFee = subtotal.multiply(
                new BigDecimal("0.04"))
                .setScale(2, RoundingMode.HALF_UP);

        BigDecimal totalAmount = subtotal.add(bookingFee);

        Booking booking = new Booking();

        booking.setUser(user);
        booking.setEvent(event);
        booking.setTicketCategoryName(category.getName());
        booking.setTicketCategory(category);
        booking.setQuantity(request.getQuantity());
        booking.setAttendeeName(request.getAttendeeName().trim());
        booking.setAttendeeEmail(request.getAttendeeEmail().trim());
        booking.setAttendeePhone(request.getAttendeePhone());
        booking.setPaymentMethod(request.getPaymentMethod());
        booking.setSubtotal(subtotal);
        booking.setBookingFee(bookingFee);
        booking.setTotalAmount(totalAmount);

        booking.setPaymentStatus("PENDING");
        booking.setStatus("PENDING");

        category.setAvailableSeats(
                category.getAvailableSeats() - request.getQuantity());

        ticketCategoryRepository.save(category);

        Booking savedBooking = bookingRepository.save(booking);

        return new BookingResponse(savedBooking);
    }

    @Transactional(readOnly = true)
    public List<BookingResponse> getMyBookings(String email) {

        if (email == null || email.isBlank()) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST, "Email is required");
        }

        return bookingRepository
                .findByAttendeeEmailIgnoreCaseOrderByCreatedAtDesc(email.trim())
                .stream()
                .map(BookingResponse::new)
                .toList();
    }

    
    @Transactional
    public BookingResponse cancelBooking(String bookingId, String email) {

        if (email == null || email.isBlank()) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST, "Email is required");
        }

        Booking booking = bookingRepository.findByBookingId(bookingId)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND, "Booking not found"));

        if (!booking.getAttendeeEmail().equalsIgnoreCase(email.trim())) {
            throw new ResponseStatusException(
                    HttpStatus.FORBIDDEN, "You cannot cancel this booking");
        }

        if ("CANCELLED".equals(booking.getStatus())) {
            throw new ResponseStatusException(
                    HttpStatus.CONFLICT, "Booking is already cancelled");
        }

        if (!"PENDING".equals(booking.getPaymentStatus())
                || !"PENDING".equals(booking.getStatus())) {
            throw new ResponseStatusException(
                    HttpStatus.CONFLICT,
                    "Only unpaid pending bookings can be cancelled automatically");
        }

        if (booking.getTicketCategory() == null) {
            throw new ResponseStatusException(
                    HttpStatus.CONFLICT,
                    "Ticket category reference is missing for this booking");
        }

        Long categoryId = booking.getTicketCategory().getId();

        TicketCategory category = ticketCategoryRepository
                .findByIdForUpdate(categoryId)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND, "Ticket category not found"));

        int updatedSeats = category.getAvailableSeats() + booking.getQuantity();

        category.setAvailableSeats(
                Math.min(updatedSeats, category.getTotalSeats()));

        ticketCategoryRepository.save(category);

        booking.setStatus("CANCELLED");

        Booking cancelledBooking = bookingRepository.save(booking);

        return new BookingResponse(cancelledBooking);
    }

}
