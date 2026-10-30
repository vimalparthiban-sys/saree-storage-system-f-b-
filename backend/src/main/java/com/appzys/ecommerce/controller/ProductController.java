package com.appzys.ecommerce.controller;

import com.appzys.ecommerce.dto.ApiResponse;
import com.appzys.ecommerce.dto.ProductTrackRequest;
import com.appzys.ecommerce.entity.Product;
import com.appzys.ecommerce.service.ProductService;
import com.appzys.ecommerce.service.SmsService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/products")
public class ProductController {

    @Autowired
    private ProductService productService;

    @Autowired
    private SmsService smsService;

    @GetMapping
    public ApiResponse<List<Product>> getAllProducts() {
        return ApiResponse.success("Products fetched successfully", productService.getAllProducts());
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<Product>> getProductById(@PathVariable String id) {
        return productService.getProductById(id)
            .map(p -> ResponseEntity.ok(ApiResponse.success("Product found", p)))
            .orElse(ResponseEntity.notFound().build());
    }

    /**
     * Endpoint triggered when a logged-in user views a product without placing an order.
     * Automatically dispatches a WhatsApp reminder with product photo like Homestrap!
     */
    @PostMapping("/track-view")
    public ApiResponse<String> trackProductView(@RequestBody ProductTrackRequest req) {
        if (req.getPhone() != null && !req.getPhone().isBlank()) {
            new Thread(() -> {
                try {
                    smsService.sendWhatsAppProductReminder(
                        req.getPhone(),
                        req.getCustomerName(),
                        req.getProductId(),
                        req.getProductTitle(),
                        req.getPrice(),
                        req.getImageUrl()
                    );
                } catch (Exception e) {
                    System.err.println("⚠️ [PRODUCT VIEW REMINDER EXCEPTION] " + e.getMessage());
                }
            }).start();
        }
        return ApiResponse.success("Product view tracked successfully", "OK");
    }
}
