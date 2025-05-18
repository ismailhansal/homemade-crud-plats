package com.homemade.backend.dao;

import org.springframework.data.jpa.repository.JpaRepository;
import com.homemade.backend.entite.User;
import org.springframework.stereotype.Repository;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    User findByEmail(String email);

}
