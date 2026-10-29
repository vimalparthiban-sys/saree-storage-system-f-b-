package com.appzys.ecommerce.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.HttpClientErrorException;
import org.springframework.web.client.HttpServerErrorException;
import org.springframework.web.client.RestTemplate;

import java.util.HashMap;
import java.util.Map;

@Service
public class SmsService {

    @Value("${appzys.sms.api-key:}")
    private String apiKey;

    private final RestTemplate restTemplate = new RestTemplate();

    /**
     * Sends a real SMS to any Indian mobile number (SIM card) via Telecom SMS Gateway (Fast2SMS / MSG91).
     * Triggers real cellular SMS notification on the user's phone!
     */
    public boolean sendOtpSms(String rawPhoneNumber, String otp) {
        String cleanPhone = rawPhoneNumber.replaceAll("[^0-9]", "");
        // If 12 digits starting with 91, extract 10 digits
        if (cleanPhone.length() == 12 && cleanPhone.startsWith("91")) {
            cleanPhone = cleanPhone.substring(2);
        }

        System.out.println("==================================================================");
        System.out.println("📱 [DISPATCHING SMS] Target Mobile: +91 " + cleanPhone);
        System.out.println("🔑 [OTP CODE] " + otp);
        System.out.println("==================================================================");

        if (apiKey == null || apiKey.isBlank()) {
            System.out.println("ℹ️ [SMS GATEWAY NOTICE] Fast2SMS API key not set in application.properties.");
            System.out.println("💡 [HELP] Add your Fast2SMS API key in application.properties: appzys.sms.api-key=YOUR_KEY");
            return false;
        }

        try {
            // Fast2SMS Official OTP Route (Dedicated route for OTPs across Indian telecoms)
            String url = "https://www.fast2sms.com/dev/bulkV2";

            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);
            headers.set("authorization", apiKey.trim());

            Map<String, Object> body = new HashMap<>();
            body.put("route", "otp");
            body.put("variables_values", otp);
            body.put("numbers", cleanPhone);

            HttpEntity<Map<String, Object>> request = new HttpEntity<>(body, headers);
            ResponseEntity<String> response = restTemplate.postForEntity(url, request, String.class);

            System.out.println("📲 [FAST2SMS GATEWAY RESPONSE] " + response.getBody());

            if (response.getStatusCode().is2xxSuccessful() && response.getBody() != null && response.getBody().contains("\"return\":true")) {
                System.out.println("✅ [REAL SMS SENT SUCCESSFULLY] Delivered to SIM card: +91 " + cleanPhone);
                return true;
            } else {
                System.out.println("⚠️ [FAST2SMS NOTICE] " + response.getBody());
                return false;
            }
        } catch (HttpClientErrorException | HttpServerErrorException e) {
            String errorResponse = e.getResponseBodyAsString();
            System.err.println("❌ [FAST2SMS API RESPONSE ERROR] Status: " + e.getStatusCode() + " - Body: " + errorResponse);
            if (errorResponse.contains("999") || errorResponse.contains("100 INR")) {
                System.out.println("💡 [FAST2SMS NOTICE] Fast2SMS requires a one-time ₹100 wallet recharge & Aadhaar/website KYC before the automated API route is activated.");
                System.out.println("👉 [FALLBACK OTP FOR TESTING] Use this OTP to log in: " + otp);
            }
            return false;
        } catch (Exception e) {
            System.err.println("❌ [SMS GATEWAY EXCEPTION] " + e.getMessage());
            return false;
        }
    }
}
