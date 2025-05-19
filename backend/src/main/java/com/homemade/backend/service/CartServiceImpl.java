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
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class CartServiceImpl implements CartService {

    private final CartRepository cartRepository;
    private final CartItemRepository cartItemRepository;
    private final UserRepository userRepository;
    private final PlatsRepository platsRepository;

    @Autowired
    public CartServiceImpl(CartRepository cartRepository, CartItemRepository cartItemRepository,
                           UserRepository userRepository, PlatsRepository platRepository) {
        this.cartRepository = cartRepository;
        this.cartItemRepository = cartItemRepository;
        this.userRepository = userRepository;
        this.platsRepository = platRepository;
    }

    @Override
    public Cart getActiveCart(Long userId) {
        Cart cart = cartRepository.findCartByClientProfile(userRepository.findById(userId).get().getClientProfile());
        if(cart == null) {
            Cart newCart = new Cart();
            newCart.setClientProfile(userRepository.findById(userId).get().getClientProfile());
            return cartRepository.save(newCart);
        }
        return cart;
    }

    @Override
    public double CalculateCartTotal(Cart cart) {
        return cart.getItems().stream().mapToDouble(e->e.getPlat().getPrix()*e.getQuantity()).sum();
    }


    /**
     * Ajoute un plat au panier d'un utilisateur.
     * Si le panier n'existe pas, il est créé.
     * Si le plat est déjà dans le panier, la quantité est augmentée.
     */
    @Transactional
    @Override
    public Cart addToCart(Long userId, Long platId, int quantity) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("Utilisateur non trouvé"));

        Plats plats = platsRepository.findById(platId)
                .orElseThrow(() -> new RuntimeException("Plat non trouvé"));

        Cart cart = getActiveCart(userId);

        // Recherche si le plat est déjà dans le panier
        Optional<CartItem> existingCartItemOpt = cart.getItems().stream()
                .filter(item -> item.getPlat().getId() == platId)
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
    @Override
    public Cart getCartByUserId(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("Utilisateur non trouvé"));
        return getActiveCart(userId);
    }

    /**
     * Supprime un plat du panier de l'utilisateur.
     */
    @Transactional
    @Override
    public void removePlatFromCart(Long userId, Long platId) {
        Cart cart = getCartByUserId(userId);
        cart.getItems().removeIf(item -> item.getPlat().getId()==platId);
        cartRepository.save(cart);
    }

    @Transactional
    @Override
    public void decreasePlatFromCart(Long userId, Long platId) {
        Cart cart = getActiveCart(userId);
        if(cart.getItems().isEmpty()) return;
        List<CartItem> cartItems = cart.getItems();
        CartItem cartItemToDecrement = cartItems.stream().filter(e -> e.getPlat().getId() == platId).findFirst().orElse(null);
        if(cartItemToDecrement != null) {
            if(cartItemToDecrement.getQuantity()>1){
                cartItemToDecrement.setQuantity(cartItemToDecrement.getQuantity()-1);
                cartItemRepository.save(cartItemToDecrement);
            }else{
                cartItemRepository.delete(cartItemToDecrement);
                cartItems.remove(cartItemToDecrement);
            }

        }
    }

    /**
     * Vide complètement le panier de l'utilisateur.
     */
    @Transactional
    @Override
    public void clearCart(Long userId) {
        Cart cart = getCartByUserId(userId);
        cart.getItems().clear();
        cartRepository.save(cart);
    }
}
