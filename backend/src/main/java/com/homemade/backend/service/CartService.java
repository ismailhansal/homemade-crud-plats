package com.homemade.backend.service;

import com.homemade.backend.dao.CartItemRepository;
import com.homemade.backend.dao.CartRepository;
import com.homemade.backend.dao.PlatsRepository;
import com.homemade.backend.dao.UserRepository;
import com.homemade.backend.entite.Cart;
import com.homemade.backend.entite.CartItem;
import com.homemade.backend.entite.Plats;
import com.homemade.backend.entite.User;
import jakarta.transaction.Transactional;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class CartService {

    private final CartRepository cartRepository;
    private final CartItemRepository cartItemRepository;
    private final UserRepository userRepository;
    private final PlatsRepository platsRepository;

    public CartService(CartRepository cartRepository, CartItemRepository cartItemRepository,
                       UserRepository userRepository, PlatsRepository platRepository) {
        this.cartRepository = cartRepository;
        this.cartItemRepository = cartItemRepository;
        this.userRepository = userRepository;
        this.platsRepository = platRepository;
    }

    /**
     * Ajoute un plat au panier d'un utilisateur.
     * Si le panier n'existe pas, il est créé.
     * Si le plat est déjà dans le panier, la quantité est augmentée.
     */
    @Transactional
    public Cart addToCart(Long userId, Long platId, int quantity) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("Utilisateur non trouvé"));

        Plats plats = platsRepository.findById(platId)
                .orElseThrow(() -> new RuntimeException("Plat non trouvé"));

        Cart cart = user.getCart();

        // Si l'utilisateur n'a pas encore de panier, on en crée un
        if (cart == null) {
            cart = new Cart();
            cart.setUser(user);
            cartRepository.save(cart);
            user.setCart(cart);
            userRepository.save(user);
        }

        // Recherche si le plat est déjà dans le panier
        Optional<CartItem> existingCartItemOpt = cart.getItems().stream()
                .filter(item -> item.getPlat().getId().equals(platId))
                .findFirst();

        if (existingCartItemOpt.isPresent()) {
            // Si présent, on met à jour la quantité
            CartItem existingCartItem = existingCartItemOpt.get();
            existingCartItem.setQuantity(existingCartItem.getQuantity() + quantity);
            cartItemRepository.save(existingCartItem);
        } else {
            // Sinon, on ajoute un nouvel item au panier
            CartItem cartItem = new CartItem();
            cartItem.setCart(cart);
            cartItem.setPlat(plats);
            cartItem.setQuantity(quantity);
            cart.getItems().add(cartItem);
            cartItemRepository.save(cartItem);
        }

        return cartRepository.save(cart);
    }

    /**
     * Retourne le panier complet de l'utilisateur avec tous les items.
     */
    public Cart getCartByUserId(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("Utilisateur non trouvé"));
        Cart cart = user.getCart();
        if (cart == null) {
            cart = new Cart();
            cart.setUser(user);
            cartRepository.save(cart);
            user.setCart(cart);
            userRepository.save(user);
        }
        return cart;
    }

    /**
     * Supprime un plat du panier de l'utilisateur.
     */
    @Transactional
    public void removePlatFromCart(Long userId, Long platId) {
        Cart cart = getCartByUserId(userId);
        cart.getItems().removeIf(item -> item.getPlat().getId().equals(platId));
        cartRepository.save(cart);
    }

    /**
     * Vide complètement le panier de l'utilisateur.
     */
    @Transactional
    public void clearCart(Long userId) {
        Cart cart = getCartByUserId(userId);
        cart.getItems().clear();
        cartRepository.save(cart);
    }
}
