package com.appzys.ecommerce.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "orders")
public class Order {

    @Id
    private String id; // 'ORD-2026-9686'

    private String customerName;
    private String phone;

    @Column(length = 1000)
    private String address;

    private Integer totalAmount;
    private String paymentMethod; // 'UPI', 'COD'
    private String paymentStatus; // 'PAID', 'PENDING'
    private String status;        // 'CONFIRMED', 'PACKED', 'SHIPPED', 'OUT_FOR_DELIVERY', 'DELIVERED'

    private String awb;           // 'AWB-DEL-982140'
    private String courier;       // 'Delhivery Express', 'Bluedart Priority'

    private LocalDateTime createdAt = LocalDateTime.now();

    @OneToMany(mappedBy = "order", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.EAGER)
    private List<OrderItem> items = new ArrayList<>();

    @OneToMany(mappedBy = "order", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.EAGER)
    private List<TrackingEvent> trackingEvents = new ArrayList<>();

    public Order() {}

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getCustomerName() { return customerName; }
    public void setCustomerName(String customerName) { this.customerName = customerName; }

    public String getPhone() { return phone; }
    public void setPhone(String phone) { this.phone = phone; }

    public String getAddress() { return address; }
    public void setAddress(String address) { this.address = address; }

    public Integer getTotalAmount() { return totalAmount; }
    public void setTotalAmount(Integer totalAmount) { this.totalAmount = totalAmount; }

    public String getPaymentMethod() { return paymentMethod; }
    public void setPaymentMethod(String paymentMethod) { this.paymentMethod = paymentMethod; }

    public String getPaymentStatus() { return paymentStatus; }
    public void setPaymentStatus(String paymentStatus) { this.paymentStatus = paymentStatus; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public String getAwb() { return awb; }
    public void setAwb(String awb) { this.awb = awb; }

    public String getCourier() { return courier; }
    public void setCourier(String courier) { this.courier = courier; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public List<OrderItem> getItems() { return items; }
    public void setItems(List<OrderItem> items) { this.items = items; }

    public List<TrackingEvent> getTrackingEvents() { return trackingEvents; }
    public void setTrackingEvents(List<TrackingEvent> trackingEvents) { this.trackingEvents = trackingEvents; }
}
