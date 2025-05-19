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
import java.util.Collections;
import java.util.List;
import java.util.stream.Collectors;

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

    @GetMapping("/items")
    public ResponseEntity<List<CartItemDto>> getCartItems(Principal principal) {
        // 1. Vérifiez l'authentification
        if (principal == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }

        // 2. Vérifiez l'utilisateur
        User user = userService.getUserByUsername(principal.getName());
        if (user == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }

        if (user.getClientProfile() == null) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN)
                    .body(Collections.emptyList());
        }

        Cart cart = cartService.getActiveCart(user.getId());

        // 3. Vérifiez le panier
        if (cart == null) {
            return ResponseEntity.ok(Collections.emptyList());
        }

        // 4. Loggez les items
        cart.getItems().forEach(item -> {
            System.out.println("Item ID: " + item.getId() +
                    ", Plat ID: " + item.getPlat().getId() +
                    ", Quantity: " + item.getQuantity());
        });

        // 5. Transformez en DTO
        List<CartItemDto> dtos = cart.getItems().stream()
                .map(item -> {
                    CartItemDto dto = new CartItemDto(
                            item.getPlat().getId(),
                            item.getPlat().getNom(),
                            item.getPlat().getPrix(),
                            item.getQuantity(),
                            item.getPlat().getImage(),
                            item.getPlat().getCook() != null ?
                                    item.getPlat().getCook().getUser().getFullName() : "Unknown"
                    );
                    return dto;
                })
                .collect(Collectors.toList());

        return ResponseEntity.ok(dtos);
    }

    /**
     * Ajouter un plat au panier.
     * Requête POST avec ID utilisateur, ID plat et quantité.
     */
    @PostMapping("/add")
    public ResponseEntity<Cart> addToCart(
            Principal principal,
            @RequestParam Long platId,
            @RequestParam(defaultValue = "1") int quantity
    ) {
        User user = userService.getUserByUsername(principal.getName());
        Cart updatedCart = cartService.addToCart(user.getId(), platId, quantity);
        return ResponseEntity.ok(updatedCart);
    }

    /**
     * Récupérer le panier d’un utilisateur.
     */
    @GetMapping("/")
    public ResponseEntity<Cart> getCartByUserId(Principal principal) {
        User user = userService.getUserByUsername(principal.getName());
        Cart cart = cartService.getCartByUserId(user.getId());
        return ResponseEntity.ok(cart);
    }

    @PostMapping("/decrease")
    public ResponseEntity<String> decreaseItem(Principal principal, @RequestParam Long platId) {
        User user = userService.getUserByUsername(principal.getName());
        cartService.decreasePlatFromCart(user.getId(), platId);
        return ResponseEntity.ok("Decreased plat from cart.");
    }
    /**
     * Supprimer un plat du panier.
     */
    @DeleteMapping("/remove")
    public ResponseEntity<String> removeFromCart(
            Principal principal,
            @RequestParam Long platId
    ) {
        User user = userService.getUserByUsername(principal.getName());
        cartService.removePlatFromCart(user.getId(), platId);
        return ResponseEntity.ok("Plat supprimé du panier.");
    }

    /**
     * Vider le panier.
     */
    @DeleteMapping("/clear")
    public ResponseEntity<String> clearCart(Principal principal) {
        User user = userService.getUserByUsername(principal.getName());
        cartService.clearCart(user.getId());
        return ResponseEntity.ok("Panier vidé.");
    }
}
