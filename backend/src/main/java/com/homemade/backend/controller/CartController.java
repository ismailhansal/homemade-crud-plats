package com.homemade.backend.controller;


import com.homemade.backend.dto.CartItemDto;
import com.homemade.backend.entite.Cart;
import com.homemade.backend.entite.User;
import com.homemade.backend.service.AuthenticationService;
import com.homemade.backend.service.CartServiceImpl;
import com.homemade.backend.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.List;

@RestController
@RequestMapping("/api/cart")
@CrossOrigin(origins = "http://localhost:3001") // ← ICI

public class CartController {

    private final CartServiceImpl cartService;
    private final AuthenticationService authenticationService;
    private final UserService userService;

    @Autowired
    public CartController(CartServiceImpl cartService, AuthenticationService authenticationService, UserService userService) {

        this.cartService = cartService;
        this.authenticationService = authenticationService;
        this.userService = userService;
    }

    public ResponseEntity<List<CartItemDto>> getCartItems(Principal principal) {
        User user = userService.getUserByUsername(principal.getName());
        Cart cart = cartService.getCartByUserId(user.getId());

        List<CartItemDto> cartItems = cart.getItems().stream().map(item -> new CartItemDto(
                item.getPlat().getId(),
                item.getPlat().getNom(),
                item.getPlat().getPrix(),
                item.getQuantity(),
                item.getPlat().getImage(),
                item.getPlat().getCook().getUser().getFullName()
        )).toList();

        return ResponseEntity.ok(cartItems);

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
