package com.appzys.ecommerce.controller;

import com.appzys.ecommerce.dto.ApiResponse;
import com.appzys.ecommerce.dto.ProductTrackRequest;
import com.appzys.ecommerce.entity.Product;
import com.appzys.ecommerce.service.AbandonedReminderService;
import com.appzys.ecommerce.service.ProductService;
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
    private AbandonedReminderService abandonedReminderService;

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
     * Endpoint triggered when a customer views a product or adds it to cart.
     * Automatically registers a single scheduled reminder (5 minutes) with product photo.
     * If user adds to cart, the reminder is upgraded to a cart reminder without duplicate dispatch.
     */
    @PostMapping("/track-view")
    public ApiResponse<String> trackProductView(@RequestBody ProductTrackRequest req) {
        if (req != null && req.getPhone() != null && !req.getPhone().isBlank()) {
            abandonedReminderService.scheduleReminder(req);
        }
        return ApiResponse.success("Product engagement tracked successfully", "OK");
    }
}
