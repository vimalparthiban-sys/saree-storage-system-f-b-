package com.appzys.ecommerce.controller;

import com.appzys.ecommerce.dto.ApiResponse;
import com.appzys.ecommerce.dto.VerifyPaymentRequest;
import com.appzys.ecommerce.entity.Order;
import com.appzys.ecommerce.service.OrderService;
import com.appzys.ecommerce.service.PaymentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/payments")
public class PaymentController {

    @Autowired
    private PaymentService paymentService;

    @Autowired
    private OrderService orderService;

    @GetMapping("/config")
    public ApiResponse<Map<String, Object>> getConfig() {
        Map<String, Object> config = new HashMap<>();
        config.put("keyId", paymentService.getKeyId());
        config.put("isTestMode", paymentService.isTestMode());
        return ApiResponse.success("Payment config fetched", config);
    }

    @PostMapping("/create-order")
    public ApiResponse<Map<String, Object>> createPaymentOrder(@RequestBody Map<String, Object> payload) {
        Integer amount = 499;
        if (payload.get("amount") != null) {
            try {
                amount = Integer.parseInt(payload.get("amount").toString());
            } catch (Exception ignored) {}
        }
        String receipt = payload.get("receipt") != null ? payload.get("receipt").toString() : null;

        Map<String, Object> orderDetails = paymentService.createOrder(amount, receipt);
        return ApiResponse.success("Razorpay order created", orderDetails);
    }

    @PostMapping("/verify")
    public ResponseEntity<ApiResponse<Order>> verifyPaymentAndPlaceOrder(@RequestBody VerifyPaymentRequest req) {
        if (req == null || req.getOrderData() == null) {
            return ResponseEntity.badRequest().body(ApiResponse.error("Invalid order verification payload"));
        }

        boolean isValid = paymentService.verifySignature(
            req.getRazorpayOrderId(),
            req.getRazorpayPaymentId(),
            req.getRazorpaySignature()
        );

        if (!isValid) {
            return ResponseEntity.status(HttpStatus.PAYMENT_REQUIRED)
                .body(ApiResponse.error("Security alert: Payment signature verification failed. Transaction was not confirmed."));
        }

        // Populate verified payment details on order data
        req.getOrderData().setRazorpayOrderId(req.getRazorpayOrderId());
        req.getOrderData().setRazorpayPaymentId(req.getRazorpayPaymentId());
        
        // Ensure method is UPI or CARD
        if (req.getOrderData().getPaymentMethod() == null || "COD".equalsIgnoreCase(req.getOrderData().getPaymentMethod())) {
            req.getOrderData().setPaymentMethod("UPI");
        }

        Order order = orderService.createOrder(req.getOrderData());
        return ResponseEntity.ok(ApiResponse.success("Payment verified and order confirmed successfully!", order));
    }
}
