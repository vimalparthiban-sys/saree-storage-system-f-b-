package com.appzys.ecommerce.controller;

import com.appzys.ecommerce.dto.*;
import com.appzys.ecommerce.entity.User;
import com.appzys.ecommerce.service.AuthService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    @Autowired
    private AuthService authService;

    @PostMapping("/register")
    public ResponseEntity<ApiResponse<User>> register(@RequestBody RegisterRequest req) {
        try {
            User user = authService.register(req);
            return ResponseEntity.ok(ApiResponse.success("Account created successfully!", user));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
    }

    @PostMapping("/login")
    public ResponseEntity<ApiResponse<User>> login(@RequestBody LoginRequest req) {
        try {
            User user = authService.login(req);
            return ResponseEntity.ok(ApiResponse.success("Welcome back, " + user.getName() + "!", user));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
    }

    @PostMapping("/forgot-password")
    public ResponseEntity<ApiResponse<Map<String, String>>> forgotPassword(@RequestBody ForgotPasswordRequest req) {
        try {
            Map<String, String> res = authService.sendOtp(req);
            return ResponseEntity.ok(ApiResponse.success(res.get("message"), res));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
    }

    @PostMapping("/validate-otp")
    public ResponseEntity<ApiResponse<Map<String, Object>>> validateOtp(@RequestBody VerifyOtpRequest req) {
        try {
            authService.validateOtp(req.getIdentifier(), req.getOtp());
            return ResponseEntity.ok(ApiResponse.success("OTP verified successfully!", Map.of("valid", true)));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
    }

    @PostMapping("/verify-otp")
    public ResponseEntity<ApiResponse<User>> verifyOtp(@RequestBody VerifyOtpRequest req) {
        try {
            User user = authService.verifyOtpAndResetPassword(req);
            return ResponseEntity.ok(ApiResponse.success("Password updated and logged in successfully!", user));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
    }

    @GetMapping("/users")
    public ApiResponse<List<User>> getAllUsers() {
        return ApiResponse.success("All registered users in MySQL", authService.getAllUsers());
    }
}
