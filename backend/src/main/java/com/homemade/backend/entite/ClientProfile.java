package com.homemade.backend.entite;


import com.fasterxml.jackson.annotation.JsonBackReference;
import jakarta.persistence.*;

@Entity
public class ClientProfile {
    @Id
    private Long idClient;

    @OneToOne
    @MapsId
    @JoinColumn(name = "user_id")
    @JsonBackReference
    private User user;

    private String adresseClient;

    @OneToOne(cascade = CascadeType.ALL)
    @JoinColumn(name = "cart_id")  // clé étrangère dans User vers Cart
    private Cart cart;
    public ClientProfile() {
    }

    public ClientProfile(Long idClient, String adresseClient) {
        this.idClient = idClient;
        this.adresseClient = adresseClient;
    }



    public Long getIdClient() {
        return idClient;
    }

    public void setIdClient(Long idClient) {
        this.idClient = idClient;
    }

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }

    public String getAdresseClient() {
        return adresseClient;
    }

    public void setAdresseClient(String adresseClient) {
        this.adresseClient = adresseClient;
    }

    public Cart getCart() {
        return cart;
    }

    public void setCart(Cart cart) {
        this.cart = cart;
    }
}
