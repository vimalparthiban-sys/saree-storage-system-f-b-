package com.appzys.ecommerce.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;

@Entity
@Table(name = "product_packs")
public class ProductPack {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Integer qty;
    private String label;
    private Integer price;
    private Integer mrp;
    private String savings;
    private Boolean isBestSeller;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "product_id")
    @JsonIgnore
    private Product product;

    public ProductPack() {}

    public ProductPack(Integer qty, String label, Integer price, Integer mrp, String savings, Boolean isBestSeller, Product product) {
        this.qty = qty;
        this.label = label;
        this.price = price;
        this.mrp = mrp;
        this.savings = savings;
        this.isBestSeller = isBestSeller;
        this.product = product;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Integer getQty() { return qty; }
    public void setQty(Integer qty) { this.qty = qty; }

    public String getLabel() { return label; }
    public void setLabel(String label) { this.label = label; }

    public Integer getPrice() { return price; }
    public void setPrice(Integer price) { this.price = price; }

    public Integer getMrp() { return mrp; }
    public void setMrp(Integer mrp) { this.mrp = mrp; }

    public String getSavings() { return savings; }
    public void setSavings(String savings) { this.savings = savings; }

    public Boolean getIsBestSeller() { return isBestSeller; }
    public void setIsBestSeller(Boolean bestSeller) { isBestSeller = bestSeller; }

    public Product getProduct() { return product; }
    public void setProduct(Product product) { this.product = product; }
}
