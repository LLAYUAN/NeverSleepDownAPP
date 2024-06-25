package org.example.backend.repository;

import org.example.backend.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import org.example.backend.model.EventTable;

import java.util.List;


@Repository
public interface EventTableRepository extends JpaRepository<EventTable, Integer> {
    void deleteByTableID(Integer tableID);
    EventTable getByTableID(Integer tableID);
    List<EventTable> findByUser(User user);
    List<EventTable> findByTableNameContainingAndUser(String tableName,User user);
    long countByUser(User user);
}
