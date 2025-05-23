package com.homemade.backend.dto;
import jakarta.validation.constraints.*;

public class PlatsDto {
    private long id;
    @NotBlank(message = "Dish name is required")
    @Size(max = 100, message = "Dish name cannot exceed 100 characters")
    private String nom;

    @Size(max = 500, message = "Description cannot exceed 500 characters")
    private String description;

    @DecimalMin(value = "0.01", message = "Price must be at least 0.01")
    private float prix;
    private String image;

    @Min(value = 0, message = "Rating cannot be negative")
    @Max(value = 5, message = "Rating cannot exceed 5")
    private int note;

    @Min(value = 1, message = "Preparation time must be at least 1 minute")
    private int temps_preparation;

    @NotBlank(message = "Cuisine type is required")
    private String type_cuisine;

    @Min(value = 1, message = "Must serve at least 1 person")
    private int nombre_personnes;
    private String ingredients;
    private String allergies;

    private String cookName;

    public PlatsDto() {}

    public PlatsDto(long id, String nom, String description, float prix, String image, int note, int temps_preparation, String type_cuisine, int nombre_personnes, String ingredients, String allergies, String cookName) {
        this.id = id;
        this.nom = nom;
        this.description = description;
        this.prix = prix;
        this.image = image;
        this.note = note;
        this.temps_preparation = temps_preparation;
        this.type_cuisine = type_cuisine;
        this.nombre_personnes = nombre_personnes;
        this.ingredients = ingredients;
        this.allergies = allergies;
        this.cookName = cookName;
    }

    public long getId() {
        return id;
    }

    public void setId(long id) {
        this.id = id;
    }

    public String getNom() {
        return nom;
    }

    public void setNom(String nom) {
        this.nom = nom;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getImage() {
        return image;
    }

    public void setImage(String image) {
        this.image = image;
    }

    public float getPrix() {
        return prix;
    }

    public void setPrix(float prix) {
        this.prix = prix;
    }

    public int getNote() {
        return note;
    }

    public void setNote(int note) {
        this.note = note;
    }

    public String getType_cuisine() {
        return type_cuisine;
    }

    public void setType_cuisine(String type_cuisine) {
        this.type_cuisine = type_cuisine;
    }

    public int getTemps_preparation() {
        return temps_preparation;
    }

    public void setTemps_preparation(int temps_preparation) {
        this.temps_preparation = temps_preparation;
    }

    public int getNombre_personnes() {
        return nombre_personnes;
    }

    public void setNombre_personnes(int nombre_personnes) {
        this.nombre_personnes = nombre_personnes;
    }

    public String getIngredients() {
        return ingredients;
    }

    public void setIngredients(String ingredients) {
        this.ingredients = ingredients;
    }

    public String getAllergies() {
        return allergies;
    }

    public void setAllergies(String allergies) {
        this.allergies = allergies;
    }

    public String getCookName() {
        return cookName;
    }

    public void setCookName(String cookName) {
        this.cookName = cookName;
    }
}
