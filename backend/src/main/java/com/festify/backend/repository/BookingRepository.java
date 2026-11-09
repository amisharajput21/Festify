
package com.festify.backend.repository;

import com.festify.backend.entity.Booking;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;

public interface BookingRepository extends JpaRepository<Booking, Long> {

    Optional<Booking> findByBookingId(String bookingId);

    List<Booking> findByUserIdOrderByCreatedAtDesc(Long userId);

    List<Booking> findByAttendeeEmailIgnoreCaseOrderByCreatedAtDesc(
        String attendeeEmail
    );
    
    @org.springframework.data.jpa.repository.Modifying
    @org.springframework.data.jpa.repository.Query(
        "UPDATE Booking b SET b.status = :status WHERE b.bookingId = :bookingId"
    )
    int updateStatus(
        @org.springframework.data.repository.query.Param("bookingId") String bookingId,
        @org.springframework.data.repository.query.Param("status") String status
    );

}
