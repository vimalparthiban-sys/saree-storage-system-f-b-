package com.appzys.ecommerce.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;

@Entity
@Table(name = "tracking_events")
public class TrackingEvent {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String status;
    private String title;
    private String time;
    private String location;
    private Boolean done = true;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "order_id")
    @JsonIgnore
    private Order order;

    public TrackingEvent() {}

    public TrackingEvent(String status, String title, String time, String location, Boolean done, Order order) {
        this.status = status;
        this.title = title;
        this.time = time;
        this.location = location;
        this.done = done;
        this.order = order;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public String getTime() { return time; }
    public void setTime(String time) { this.time = time; }

    public String getLocation() { return location; }
    public void setLocation(String location) { this.location = location; }

    public Boolean getDone() { return done; }
    public void setDone(Boolean done) { this.done = done; }

    public Order getOrder() { return order; }
    public void setOrder(Order order) { this.order = order; }
}
