
package com.festify.backend.repository;

import com.festify.backend.entity.TicketCategory;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;
import jakarta.persistence.LockModeType;
import org.springframework.data.jpa.repository.Lock;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface TicketCategoryRepository
        extends JpaRepository<TicketCategory, Long> {

    List<TicketCategory> findByEventId(Long eventId);

    Optional<TicketCategory> findByIdAndEventId(
        Long id,
        Long eventId
    );
        @Lock(LockModeType.PESSIMISTIC_WRITE)
    @Query("SELECT t FROM TicketCategory t WHERE t.id = :id")
    Optional<TicketCategory> findByIdForUpdate(
        @Param("id") Long id
    );
}
