package com.appzys.ecommerce.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "reviews")
public class Review {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String productId;

    @Column(nullable = false)
    private String name;

    private String city;

    @Column(nullable = false)
    private Integer rating;

    private String date;

    @Column(nullable = false)
    private String title;

    @Column(length = 2000, nullable = false)
    private String comment;

    private Boolean verified = true;

    private LocalDateTime createdAt = LocalDateTime.now();

    public Review() {}

    public Review(String productId, String name, String city, Integer rating, String date, String title, String comment, Boolean verified) {
        this.productId = productId;
        this.name = name;
        this.city = city;
        this.rating = rating;
        this.date = date;
        this.title = title;
        this.comment = comment;
        this.verified = verified;
        this.createdAt = LocalDateTime.now();
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getProductId() { return productId; }
    public void setProductId(String productId) { this.productId = productId; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getCity() { return city; }
    public void setCity(String city) { this.city = city; }

    public Integer getRating() { return rating; }
    public void setRating(Integer rating) { this.rating = rating; }

    public String getDate() { return date; }
    public void setDate(String date) { this.date = date; }

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public String getComment() { return comment; }
    public void setComment(String comment) { this.comment = comment; }

    public Boolean getVerified() { return verified; }
    public void setVerified(Boolean verified) { this.verified = verified; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}
