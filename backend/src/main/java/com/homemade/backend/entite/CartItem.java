package com.homemade.backend.entite;

import jakarta.persistence.*;

@Entity
public class CartItem {
    @Id @GeneratedValue
    private Long id;

    private int quantity;

    @ManyToOne
    @JoinColumn(name = "cart_id")
    private Cart cart;

    @ManyToOne
    @JoinColumn(name = "plat_id")
    private Plats plat;

    public Plats getPlat() {
        return plat;
    }
    public void setPlat(Plats plat) {
        this.plat = plat;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public int getQuantity() {
        return quantity;
    }

    public void setQuantity(int quantity) {
        this.quantity = quantity;
    }

    public Cart getCart() {
        return cart;
    }

    public void setCart(Cart cart) {
        this.cart = cart;
    }

}
