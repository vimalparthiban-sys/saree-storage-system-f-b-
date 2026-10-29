package com.appzys.ecommerce.controller;

import com.appzys.ecommerce.dto.ApiResponse;
import com.appzys.ecommerce.dto.CreateOrderRequest;
import com.appzys.ecommerce.entity.Order;
import com.appzys.ecommerce.service.OrderService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/orders")
public class OrderController {

    @Autowired
    private OrderService orderService;

    @PostMapping
    public ApiResponse<Order> createOrder(@RequestBody CreateOrderRequest request) {
        Order order = orderService.createOrder(request);
        return ApiResponse.success("Order placed successfully!", order);
    }

    @GetMapping("/{orderId}")
    public ResponseEntity<ApiResponse<Order>> getOrder(@PathVariable String orderId) {
        return orderService.getOrderById(orderId)
            .map(o -> ResponseEntity.ok(ApiResponse.success("Order found", o)))
            .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/tracking/{awb}")
    public ResponseEntity<ApiResponse<Order>> getOrderByAwb(@PathVariable String awb) {
        return orderService.getOrderByAwb(awb)
            .map(o -> ResponseEntity.ok(ApiResponse.success("Tracking details found", o)))
            .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/user/{phone}")
    public ApiResponse<List<Order>> getCustomerOrders(@PathVariable String phone) {
        return ApiResponse.success("Customer orders fetched", orderService.getOrdersByPhone(phone));
    }
}
