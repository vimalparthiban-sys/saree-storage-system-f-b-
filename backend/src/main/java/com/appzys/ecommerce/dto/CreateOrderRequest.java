package com.appzys.ecommerce.dto;

import java.util.List;

public class CreateOrderRequest {
    private String customerName;
    private String phone;
    private String address;
    private Integer totalAmount;
    private String paymentMethod;
    private List<OrderItemDto> items;

    public static class OrderItemDto {
        private String productId;
        private String title;
        private String packName;
        private String color;
        private Integer quantity;
        private Integer price;

        public String getProductId() { return productId; }
        public void setProductId(String productId) { this.productId = productId; }

        public String getTitle() { return title; }
        public void setTitle(String title) { this.title = title; }

        public String getPackName() { return packName; }
        public void setPackName(String packName) { this.packName = packName; }

        public String getColor() { return color; }
        public void setColor(String color) { this.color = color; }

        public Integer getQuantity() { return quantity; }
        public void setQuantity(Integer quantity) { this.quantity = quantity; }

        public Integer getPrice() { return price; }
        public void setPrice(Integer price) { this.price = price; }
    }

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

    public List<OrderItemDto> getItems() { return items; }
    public void setItems(List<OrderItemDto> items) { this.items = items; }
}
