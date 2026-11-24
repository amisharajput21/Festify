
package com.festify.backend.repository;

import com.festify.backend.entity.Event;
import com.festify.backend.entity.EventStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface EventRepository extends JpaRepository<Event, Long> {

    List<Event> findByOrganizer_Id(Long organizerId);

    Optional<Event> findByIdAndOrganizer_Id(Long id, Long organizerId);

    List<Event> findByStatus(EventStatus status);

    Optional<Event> findByIdAndStatus(Long id, EventStatus status);
}
