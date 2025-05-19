package com.homemade.backend.dao;

import com.homemade.backend.entite.CookProfile;
import com.homemade.backend.entite.Plats;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PlatsRepository extends JpaRepository<Plats, Long> {
    List<Plats> findByCook(CookProfile cook);

}
