package com.homemade.backend.service;

import com.homemade.backend.entite.Cart;

public interface CartService {

    Cart getActiveCart(Long userId);
    double CalculateCartTotal(Cart cart);
    void clearCart(Long userId);
    Cart addToCart(Long userId, Long platId, int quantity);
    Cart getCartByUserId(Long userId);
    void removePlatFromCart(Long userId, Long platId);
    void decreasePlatFromCart(Long userId, Long platId);
}
