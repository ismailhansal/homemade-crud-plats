package com.homemade.backend.dao;

import com.homemade.backend.entite.CartItem;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CartItemRepository extends JpaRepository<CartItem, Long> {
}
