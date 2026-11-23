package com.festify.backend.repository;

import com.festify.backend.entity.TicketCategory;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface TicketCategoryRepository
        extends JpaRepository<TicketCategory, Long> {

    List<TicketCategory> findByEventId(Long eventId);

    Optional<TicketCategory> findByIdAndEventId(
        Long id,
        Long eventId
    );

    @Query(value = "SELECT * FROM ticket_categories WHERE id = :id FOR UPDATE", nativeQuery = true)
    Optional<TicketCategory> findByIdForUpdate(
        @Param("id") Long id
    );
}