
package com.festify.backend.controller;

import com.festify.backend.dto.BookingRequest;
import com.festify.backend.dto.BookingResponse;
import com.festify.backend.service.BookingService;

import jakarta.validation.Valid;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/bookings")
@CrossOrigin(origins = {
    "http://localhost:3000",
    "http://localhost:3001",
    "http://localhost:5173"
})
public class BookingController {

    private final BookingService bookingService;

    public BookingController(BookingService bookingService) {
        this.bookingService = bookingService;
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public BookingResponse createBooking(
            @Valid @RequestBody BookingRequest request) {

        return bookingService.createBooking(request);
    }

    @GetMapping("/my")
    public List<BookingResponse> getMyBookings(
            @RequestParam String email) {

        return bookingService.getMyBookings(email);
    }

        @PutMapping("/{bookingId}/cancel")
    public BookingResponse cancelBooking(
            @PathVariable String bookingId,
            @RequestParam String email) {

        return bookingService.cancelBooking(bookingId, email);
    }
}
