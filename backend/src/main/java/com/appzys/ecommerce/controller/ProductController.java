package com.appzys.ecommerce.controller;

import com.appzys.ecommerce.dto.ApiResponse;
import com.appzys.ecommerce.entity.Product;
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
}
