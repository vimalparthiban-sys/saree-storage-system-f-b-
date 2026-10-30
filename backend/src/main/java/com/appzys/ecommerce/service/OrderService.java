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

    @Autowired
    private SmsService smsService;

    @Autowired
    private AbandonedReminderService abandonedReminderService;

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

        String itemTitle = "";
        String itemColor = "";
        String itemProductId = "";
        String itemImgUrl = "";

        if (req.getItems() != null && !req.getItems().isEmpty()) {
            CreateOrderRequest.OrderItemDto firstItem = req.getItems().get(0);
            itemTitle = firstItem.getTitle();
            itemColor = firstItem.getColor();
            itemProductId = firstItem.getProductId();
            itemImgUrl = firstItem.getImageUrl();

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
        final String finalItemTitle = itemTitle;
        final String finalItemColor = itemColor;
        final String finalImageUrl = resolveImageUrl(itemProductId, itemColor, itemImgUrl);

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

        Order savedOrder = orderRepository.save(order);

        // Cancel any pending abandoned cart / view reminders for this customer since they purchased!
        if (savedOrder.getPhone() != null && !savedOrder.getPhone().isBlank()) {
            try {
                abandonedReminderService.cancelRemindersForPhone(savedOrder.getPhone());
            } catch (Exception ex) {
                System.err.println("⚠️ [CANCEL REMINDER ERROR] " + ex.getMessage());
            }

            // Auto Dispatch Real WhatsApp Confirmation Message WITH PRODUCT PHOTO directly to customer's mobile
            new Thread(() -> {
                try {
                    smsService.sendWhatsAppOrderConfirmation(
                        savedOrder.getPhone(),
                        savedOrder.getCustomerName(),
                        savedOrder.getId(),
                        savedOrder.getAwb(),
                        savedOrder.getTotalAmount(),
                        finalItemTitle,
                        finalItemColor,
                        finalImageUrl
                    );
                } catch (Exception ex) {
                    System.err.println("⚠️ [ASYNC WHATSAPP ORDER DISPATCH ERROR] " + ex.getMessage());
                }
            }).start();
        }

        return savedOrder;
    }

    private String resolveImageUrl(String productId, String color, String explicitUrl) {
        if (explicitUrl != null && !explicitUrl.isBlank()) {
            if (explicitUrl.startsWith("http")) return explicitUrl;
            return "https://saree-storage-system-f-b.onrender.com" + (explicitUrl.startsWith("/") ? "" : "/") + explicitUrl;
        }
        String c = (color != null) ? color.toLowerCase() : "";
        if (productId != null && productId.contains("jewel")) {
            return "https://saree-storage-system-f-b.onrender.com/images/jewel-organiser-1.jpg";
        }
        if (c.contains("houndstooth") || c.contains("black")) {
            return "https://saree-storage-system-f-b.onrender.com/images/saree-organiser-houndstooth-1.jpg";
        }
        if (c.contains("floral") || c.contains("brown")) {
            return "https://saree-storage-system-f-b.onrender.com/images/saree-organiser-brown-floral-1.jpg";
        }
        if (c.contains("beige") || c.contains("grid")) {
            return "https://saree-storage-system-f-b.onrender.com/images/saree-organiser-beige-geometric-1.jpg";
        }
        return "https://saree-storage-system-f-b.onrender.com/images/saree-organiser-navy-1.jpg";
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
