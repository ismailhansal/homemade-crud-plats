package com.homemade.backend.dao;

import com.homemade.backend.entite.ClientProfile;
import org.springframework.data.jpa.repository.JpaRepository;
import com.homemade.backend.entite.User;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    User findByEmail(String email);

    @Query("SELECT u.clientProfile FROM User u WHERE u.id = :userId")
    Optional<ClientProfile> findClientProfileByUserId(@Param("userId") Long userId);

}
