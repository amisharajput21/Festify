
package com.festify.backend.repository;

import com.festify.backend.entity.OrganizerApplication;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface OrganizerApplicationRepository
        extends JpaRepository<OrganizerApplication, Long> {

    List<OrganizerApplication> findByStatusOrderByCreatedAtDesc(String status);

    Optional<OrganizerApplication> findByUserIdAndStatus(
            Long userId, String status);

    boolean existsByUserIdAndStatus(Long userId, String status);
}
