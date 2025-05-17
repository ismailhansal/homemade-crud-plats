package com.homemade.backend.dao;

import com.homemade.backend.entite.Cart;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.repository.CrudRepository;

public interface CartRepository extends JpaRepository<Cart, Long>{

}
