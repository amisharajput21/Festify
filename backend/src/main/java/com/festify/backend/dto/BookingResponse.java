
package com.festify.backend.dto;

import com.festify.backend.entity.Booking;
import java.math.BigDecimal;
import java.time.LocalDateTime;

public class BookingResponse {

    private String bookingId;
    private Long eventId;
    private String eventTitle;
    private String ticketCategoryName;
    private Integer quantity;
    private String attendeeName;
    private String attendeeEmail;
    private BigDecimal subtotal;
    private BigDecimal bookingFee;
    private BigDecimal totalAmount;
    private String paymentStatus;
    private String status;
    private LocalDateTime createdAt;

    public BookingResponse(Booking booking) {
        this.bookingId = booking.getBookingId();
        this.eventId = booking.getEvent().getId();
        this.eventTitle = booking.getEvent().getTitle();
        this.ticketCategoryName = booking.getTicketCategoryName();
        this.quantity = booking.getQuantity();
        this.attendeeName = booking.getAttendeeName();
        this.attendeeEmail = booking.getAttendeeEmail();
        this.subtotal = booking.getSubtotal();
        this.bookingFee = booking.getBookingFee();
        this.totalAmount = booking.getTotalAmount();
        this.paymentStatus = booking.getPaymentStatus();
        this.status = booking.getStatus();
        this.createdAt = booking.getCreatedAt();
    }

    public String getBookingId() { return bookingId; }
    public Long getEventId() { return eventId; }
    public String getEventTitle() { return eventTitle; }
    public String getTicketCategoryName() { return ticketCategoryName; }
    public Integer getQuantity() { return quantity; }
    public String getAttendeeName() { return attendeeName; }
    public String getAttendeeEmail() { return attendeeEmail; }
    public BigDecimal getSubtotal() { return subtotal; }
    public BigDecimal getBookingFee() { return bookingFee; }
    public BigDecimal getTotalAmount() { return totalAmount; }
    public String getPaymentStatus() { return paymentStatus; }
    public String getStatus() { return status; }
    public LocalDateTime getCreatedAt() { return createdAt; }
}
