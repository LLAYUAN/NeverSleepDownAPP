package org.example.backend.repository;

import jakarta.transaction.Transactional;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import org.springframework.data.jpa.repository.JpaRepository;
import org.example.backend.model.User;

@Repository
public interface UserRepository extends JpaRepository<User, String>{
    @Query("SELECT u FROM User u WHERE u.userID = :userID")
    User findByUserID(String userID);
}
