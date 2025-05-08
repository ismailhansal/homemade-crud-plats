package com.homemade.backend.dao;

import com.homemade.backend.entite.Plats;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface PlatsRepository extends CrudRepository<Plats, Long> {


}
