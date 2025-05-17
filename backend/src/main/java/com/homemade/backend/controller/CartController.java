package com.homemade.backend.controller;


import com.homemade.backend.entite.Cart;
import com.homemade.backend.service.CartService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/cart")
@CrossOrigin(origins = "http://localhost:3001") // ← ICI

public class CartController {

    private final CartService cartService;

    public CartController(CartService cartService) {
        this.cartService = cartService;
    }

    /**
     * Ajouter un plat au panier.
     * Requête POST avec ID utilisateur, ID plat et quantité.
     */
    @PostMapping("/add")
    public ResponseEntity<Cart> addToCart(
            @RequestParam Long userId,
            @RequestParam Long platId,
            @RequestParam(defaultValue = "1") int quantity
    ) {
        Cart updatedCart = cartService.addToCart(userId, platId, quantity);
        return ResponseEntity.ok(updatedCart);
    }

    /**
     * Récupérer le panier d’un utilisateur.
     */
    @GetMapping("/{userId}")
    public ResponseEntity<Cart> getCartByUserId(@PathVariable Long userId) {
        Cart cart = cartService.getCartByUserId(userId);
        return ResponseEntity.ok(cart);
    }

    /**
     * Supprimer un plat du panier.
     */
    @DeleteMapping("/remove")
    public ResponseEntity<String> removeFromCart(
            @RequestParam Long userId,
            @RequestParam Long platId
    ) {
        cartService.removePlatFromCart(userId, platId);
        return ResponseEntity.ok("Plat supprimé du panier.");
    }

    /**
     * Vider le panier.
     */
    @DeleteMapping("/clear/{userId}")
    public ResponseEntity<String> clearCart(@PathVariable Long userId) {
        cartService.clearCart(userId);
        return ResponseEntity.ok("Panier vidé.");
    }
}
