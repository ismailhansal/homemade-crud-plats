package com.homemade.backend.entite;


import com.fasterxml.jackson.annotation.JsonBackReference;
import jakarta.persistence.*;

@Entity
public class CookProfile {

    @Id
    private Long idCook;

    @OneToOne
    @MapsId
    @JoinColumn(name = "user_id")
    @JsonBackReference
    private User user;

    private String cookAddress;
    private Boolean Verified = false;
    private float cookRating = 0.0F;
    private String specialty;
    private float earnings = 0.0F;

    public CookProfile() {
    }

    public CookProfile(Long idCook, User user, String cookAddress, String specialty) {
        this.idCook = idCook;
        this.user = user;
        this.cookAddress = cookAddress;
        this.specialty = specialty;
    }



    public Long getIdCook() {
        return idCook;
    }

    public void setIdCook(Long idCook) {
        this.idCook = idCook;
    }

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }

    public String getCookAddress() {
        return cookAddress;
    }

    public void setCookAddress(String cookAddress) {
        this.cookAddress = cookAddress;
    }

    public Boolean getVerified() {
        return Verified;
    }

    public void setVerified(Boolean verified) {
        Verified = verified;
    }

    public float getCookRating() {
        return cookRating;
    }

    public void setCookRating(float cookRating) {
        this.cookRating = cookRating;
    }

    public String getSpecialty() {
        return specialty;
    }

    public void setSpecialty(String specialty) {
        this.specialty = specialty;
    }

    public float getEarnings() {
        return earnings;
    }

    public void setEarnings(float earnings) {
        this.earnings = earnings;
    }
}
