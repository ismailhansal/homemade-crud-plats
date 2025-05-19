package com.homemade.backend.dto;

public class PlatsDto {
    private long id;
    private String nom;
    private String description;
    private float prix;
    private String image;
    private int note;
    private int temps_preparation;
    private String type_cuisine;
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
