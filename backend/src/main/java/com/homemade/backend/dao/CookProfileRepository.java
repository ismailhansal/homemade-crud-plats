package com.homemade.backend.dao;

import com.homemade.backend.entite.CookProfile;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface CookProfileRepository extends JpaRepository<CookProfile, Long> {
}
