package com.appzys.ecommerce.service;

import com.appzys.ecommerce.dto.CreateOrderRequest;
import com.appzys.ecommerce.entity.Order;
import com.appzys.ecommerce.entity.OrderItem;
import com.appzys.ecommerce.entity.TrackingEvent;
import com.appzys.ecommerce.repository.OrderRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.Optional;
import java.util.Random;

@Service
public class OrderService {

    @Autowired
    private OrderRepository orderRepository;

    public Order createOrder(CreateOrderRequest req) {
        Order order = new Order();
        String orderId = "ORD-2026-" + (1000 + new Random().nextInt(9000));
        String awb = "AWB-DEL-" + (100000 + new Random().nextInt(900000));

        order.setId(orderId);
        order.setCustomerName(req.getCustomerName());
        order.setPhone(req.getPhone());
        order.setAddress(req.getAddress());
        order.setTotalAmount(req.getTotalAmount());
        order.setPaymentMethod(req.getPaymentMethod());
        order.setPaymentStatus("COD".equalsIgnoreCase(req.getPaymentMethod()) ? "PENDING" : "PAID");
        order.setStatus("CONFIRMED");
        order.setAwb(awb);
        order.setCourier("Delhivery Express");
        order.setCreatedAt(LocalDateTime.now());

        if (req.getItems() != null) {
            for (CreateOrderRequest.OrderItemDto itemDto : req.getItems()) {
                OrderItem item = new OrderItem(
                    itemDto.getProductId(),
                    itemDto.getTitle(),
                    itemDto.getPackName(),
                    itemDto.getColor(),
                    itemDto.getQuantity(),
                    itemDto.getPrice(),
                    order
                );
                order.getItems().add(item);
            }
        }

        DateTimeFormatter timeFormatter = DateTimeFormatter.ofPattern("hh:mm a");
        String nowTime = LocalDateTime.now().format(timeFormatter);

        TrackingEvent initialEvent = new TrackingEvent(
            "CONFIRMED",
            "Order Confirmed & Payment Verified",
            nowTime + ", Today",
            "APPZYS Central Online Gateway",
            true,
            order
        );
        order.getTrackingEvents().add(initialEvent);

        return orderRepository.save(order);
    }

    public Optional<Order> getOrderById(String orderId) {
        return orderRepository.findById(orderId);
    }

    public Optional<Order> getOrderByAwb(String awb) {
        return orderRepository.findByAwb(awb);
    }

    public List<Order> getOrdersByPhone(String phone) {
        return orderRepository.findByPhoneOrderByCreatedAtDesc(phone);
    }

    public List<Order> getAllOrders() {
        return orderRepository.findAllByOrderByCreatedAtDesc();
    }
}
