package com.appzys.ecommerce.entity;

import jakarta.persistence.*;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "products")
public class Product {

    @Id
    private String id; // 'saree-organiser', 'jewellery-organiser'

    private String brand;
    private String title;
    private String cardTitle;
    private String shortTitle;
    private String category;
    private String categorySlug;

    private Double rating;
    private Integer reviewCount;
    private Boolean inStock;

    private Integer basePrice;
    private Integer mrp;
    private Integer discountPercent;

    @Column(length = 2000)
    private String description;

    @OneToMany(mappedBy = "product", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.EAGER)
    private List<ProductPack> packs = new ArrayList<>();

    public Product() {}

    public Product(String id, String brand, String title, String shortTitle, String category, Double rating, Integer reviewCount, Integer basePrice, Integer mrp, String description) {
        this.id = id;
        this.brand = brand;
        this.title = title;
        this.cardTitle = title;
        this.shortTitle = shortTitle;
        this.category = category;
        this.categorySlug = id;
        this.rating = rating;
        this.reviewCount = reviewCount;
        this.inStock = true;
        this.basePrice = basePrice;
        this.mrp = mrp;
        this.discountPercent = (int) Math.round(((double)(mrp - basePrice) / mrp) * 100);
        this.description = description;
    }

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getBrand() { return brand; }
    public void setBrand(String brand) { this.brand = brand; }

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public String getCardTitle() { return cardTitle; }
    public void setCardTitle(String cardTitle) { this.cardTitle = cardTitle; }

    public String getShortTitle() { return shortTitle; }
    public void setShortTitle(String shortTitle) { this.shortTitle = shortTitle; }

    public String getCategory() { return category; }
    public void setCategory(String category) { this.category = category; }

    public String getCategorySlug() { return categorySlug; }
    public void setCategorySlug(String categorySlug) { this.categorySlug = categorySlug; }

    public Double getRating() { return rating; }
    public void setRating(Double rating) { this.rating = rating; }

    public Integer getReviewCount() { return reviewCount; }
    public void setReviewCount(Integer reviewCount) { this.reviewCount = reviewCount; }

    public Boolean getInStock() { return inStock; }
    public void setInStock(Boolean inStock) { this.inStock = inStock; }

    public Integer getBasePrice() { return basePrice; }
    public void setBasePrice(Integer basePrice) { this.basePrice = basePrice; }

    public Integer getMrp() { return mrp; }
    public void setMrp(Integer mrp) { this.mrp = mrp; }

    public Integer getDiscountPercent() { return discountPercent; }
    public void setDiscountPercent(Integer discountPercent) { this.discountPercent = discountPercent; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public List<ProductPack> getPacks() { return packs; }
    public void setPacks(List<ProductPack> packs) { this.packs = packs; }
}
