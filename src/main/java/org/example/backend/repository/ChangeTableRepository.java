package org.example.backend.repository;

import org.springframework.stereotype.Repository;
import org.springframework.data.jpa.repository.JpaRepository;
import org.example.backend.model.*;

@Repository
public interface ChangeTableRepository extends JpaRepository<ChangeTable, Integer>{
}
