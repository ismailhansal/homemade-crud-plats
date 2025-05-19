package com.homemade.backend.dto;

public class CartItemDto {
    private Long id;
    private String name;
    private float price;
    private int quantity;
    private String image;
    private String cook;

    public CartItemDto() {

    }
    public CartItemDto(Long id, String name, float price, int quantity, String image, String cook) {
        this.id = id;
        this.name = name;
        this.price = price;
        this.quantity = quantity;
        this.image = image;
        this.cook = cook;
    }
    public Long getId() {
        return id;
    }
    public void setId(Long id) {
        this.id = id;
    }
    public String getName() {
        return name;
    }
    public void setName(String name) {
        this.name = name;
    }
    public float getPrice() {
        return price;
    }
    public void setPrice(float price) {
        this.price = price;
    }
    public int getQuantity() {
        return quantity;
    }
    public void setQuantity(int quantity) {
        this.quantity = quantity;
    }
    public String getImage() {
        return image;
    }
    public void setImage(String image) {
        this.image = image;
    }
    public String getCook() {
        return cook;
    }
    public void setCook(String cook) {
        this.cook = cook;
    }


}
