package com.appzys.ecommerce.controller;

import com.appzys.ecommerce.dto.ApiResponse;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import java.util.Map;

@RestController
@RequestMapping("/api")
public class HealthController {

    @GetMapping("/health")
    public ApiResponse<Map<String, String>> healthCheck() {
        return ApiResponse.success("APPZYS Spring Boot Backend is healthy and running!", Map.of(
            "status", "UP",
            "version", "1.0.0",
            "framework", "Spring Boot 3.3.4 (Java 21)",
            "store", "APPZYS Smart Storage Solutions"
        ));
    }
}
