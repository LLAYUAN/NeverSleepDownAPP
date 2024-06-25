package org.example.backend.repository;

import jakarta.transaction.Transactional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import org.example.backend.model.EventTime;

@Repository
public interface EventTimeRepository extends JpaRepository<EventTime, Integer> {
}
