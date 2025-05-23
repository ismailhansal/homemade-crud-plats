package com.homemade.backend.entite;

import jakarta.persistence.*;

import java.util.ArrayList;
import java.util.List;

@Entity
public class Cart {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne(mappedBy = "cart")
    private ClientProfile clientProfile;

    @OneToMany(mappedBy = "cart", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<CartItem> items = new ArrayList<>();

    private float fraisLivraison = 0.0F;




    public Cart() {
    }

    public Cart(ClientProfile clientProfile, List<CartItem> items, float fraisLivraison) {
        this.clientProfile = clientProfile;
        this.items = items;
        this.fraisLivraison = fraisLivraison;
    }

    public ClientProfile getClientProfile() {
        return clientProfile;
    }

    public void setClientProfile(ClientProfile clientProfile) {
        this.clientProfile = clientProfile;
    }

    public float getFraisLivraison() {
        return fraisLivraison;
    }

    public void setFraisLivraison(float fraisLivraison) {
        this.fraisLivraison = fraisLivraison;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public List<CartItem> getItems() {
        return items;
    }

    public void setItems(List<CartItem> items) {
        this.items = items;
    }

}

