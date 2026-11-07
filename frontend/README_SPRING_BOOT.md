# Festify - Java 21 Spring Boot & MySQL Backend Integration Guide

This frontend application is built specifically to pair seamlessly with your upcoming **Java 21 Spring Boot 3.x** microservices / monolithic backend with **MySQL 8.0+**.

---

## 1. REST Endpoints Specification

Configure your Spring Boot `@RestController` classes with `@CrossOrigin(origins = "*")` (or your Vite dev server port 3000) and `@RequestMapping("/api/v1")`:

### A. Events Controller (`/api/v1/events`)
- **`GET /api/v1/events`**
  - **Query Params**:
    - `search` (Optional, String): Search keyword matching event title, artist, or venue.
    - `city` (Optional, String): Filter by city (`Delhi`, `Mumbai`, `Bengaluru`, `Hyderabad`, `Pune`, `Jaipur`, `Agra`, `Kolkata`).
    - `category` (Optional, String): Filter by category (`Music`, `Concerts`, `Festivals`, `Comedy`, `Sports`, `Workshops`, `Nightlife`).
    - `featured` (Optional, Boolean): If `true`, return featured spotlight events.
  - **Response**: `List<EventDTO>`
- **`GET /api/v1/events/{id}`**
  - **Response**: `EventDTO` (including nested `ticketCategories`).

### B. Bookings Controller (`/api/v1/bookings`)
- **`POST /api/v1/bookings`**
  - **Request Body**: `BookingRequestDTO`
    ```json
    {
      "eventId": "ev-01",
      "ticketCategoryId": "tc-01-gold",
      "quantity": 2,
      "attendeeName": "Aarav Sharma",
      "attendeeEmail": "aarav.sharma@example.com",
      "attendeePhone": "+91 98765 43210",
      "paymentMethod": "UPI"
    }
    ```
  - **Response**: `BookingDTO` (with generated `bookingId` e.g. `FST-2026-9821`, calculated tax/convenience fee, and QR code URL).
- **`GET /api/v1/bookings/my-tickets`**
  - **Query Param**: `email` (Optional, String): Email of the attendee to retrieve past and active reservations.
  - **Response**: `List<BookingDTO>`

### C. Auth Controller (`/api/v1/auth`)
- **`POST /api/v1/auth/login`**
  - **Request Body**: `{"email": "...", "password": "..."}`
  - **Response**: `UserDTO` (+ JWT token in header or body)
- **`POST /api/v1/auth/register`**
  - **Request Body**: `{"name": "...", "email": "...", "phone": "...", "city": "...", "password": "..."}`
  - **Response**: `UserDTO`

---

## 2. Recommended Spring Boot JPA Entities (Java 21)

### `Event.java`
```java
package com.festify.backend.entity;

import jakarta.persistence.*;
import lombok.*;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

@Entity
@Table(name = "events")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class Event {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;

    @Column(nullable = false)
    private String title;

    private String slug;

    @Enumerated(EnumType.STRING)
    private EventCategory category;

    @Column(nullable = false)
    private String city;

    private LocalDate eventDate;
    private String displayDate;
    private String time;
    private String venue;
    private String address;

    private BigDecimal startingPrice;
    private String image;
    private boolean featured;
    private boolean trending;

    @Column(columnDefinition = "TEXT")
    private String description;

    @OneToMany(mappedBy = "event", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<TicketCategory> ticketCategories;
}
```

### `Booking.java`
```java
package com.festify.backend.entity;

import jakarta.persistence.*;
import lombok.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "bookings")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class Booking {
    @Id
    private String bookingId; // e.g. FST-2026-9821

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "event_id")
    private Event event;

    private String eventTitle;
    private String eventImage;
    private String city;
    private String venue;
    private String eventDate;
    private String eventTime;

    private String ticketCategoryName;
    private int quantity;
    private BigDecimal unitPrice;
    private BigDecimal subtotal;
    private BigDecimal convenienceFee;
    private BigDecimal totalAmount;

    private String attendeeName;
    private String attendeeEmail;
    private String attendeePhone;
    private String paymentMethod;

    @Enumerated(EnumType.STRING)
    private BookingStatus status; // CONFIRMED, CANCELLED

    private LocalDateTime createdAt;
}
```

---

## 3. Connecting Frontend to Spring Boot

In `.env`:
```bash
VITE_API_URL=http://localhost:8080/api/v1
```

When `VITE_API_URL` is set, all frontend requests route directly to your Spring Boot REST server. If the server is offline or in development preview, Festify automatically and gracefully falls back to persistent LocalStorage.
