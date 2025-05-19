package com.homemade.backend.dao;

import com.homemade.backend.entite.Cart;
import com.homemade.backend.entite.ClientProfile;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface CartRepository extends JpaRepository<Cart, Long>{
    Cart findCartByClientProfile(ClientProfile clientProfile);
}
