package com.appzys.ecommerce.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.time.Duration;

@Service
public class SmsService {

    @Value("${BREVO_API_KEY:}")
    private String brevoApiKey;

    @Value("${appzys.sms.api-key:}")
    private String fast2smsApiKey;

    private final HttpClient httpClient = HttpClient.newBuilder()
            .connectTimeout(Duration.ofSeconds(8))
            .build();

    /**
     * Sends a real SMS to any Indian mobile number via Brevo HTTPS SMS Gateway / Fast2SMS.
     * Uses Port 443 (HTTPS) - 100% compatible with Render Cloud!
     */
    public boolean sendOtpSms(String rawPhoneNumber, String otp) {
        String cleanPhone = rawPhoneNumber.replaceAll("[^0-9]", "");
        if (cleanPhone.length() == 12 && cleanPhone.startsWith("91")) {
            cleanPhone = cleanPhone.substring(2);
        }

        String recipientWithCountry = "91" + cleanPhone;

        System.out.println("==================================================================");
        System.out.println("📱 [DISPATCHING REAL SMS] Target Mobile: +91 " + cleanPhone);
        System.out.println("🔑 [OTP CODE] " + otp);
        System.out.println("==================================================================");

        // 1. Try Brevo Transactional SMS HTTPS API first (Uses the same BREVO_API_KEY!)
        if (brevoApiKey != null && !brevoApiKey.isBlank()) {
            boolean brevoSmsSuccess = sendViaBrevoSms(recipientWithCountry, otp);
            if (brevoSmsSuccess) {
                return true;
            }
            System.out.println("⚠️ [SMS FALLBACK] Brevo SMS failed or credits depleted, attempting Fast2SMS...");
        }

        // 2. Fallback to Fast2SMS Gateway
        if (fast2smsApiKey != null && !fast2smsApiKey.isBlank()) {
            return sendViaFast2Sms(cleanPhone, otp);
        }

        System.out.println("ℹ️ [SMS NOTICE] Brevo/Fast2SMS SMS logged to console. OTP for verification: " + otp);
        return false;
    }

    private boolean sendViaBrevoSms(String recipient, String otp) {
        try {
            String content = "Your APPZYS verification code is " + otp + ". Valid for 10 minutes.";
            String jsonPayload = String.format(
                "{\"sender\":\"APPZYS\",\"recipient\":\"%s\",\"content\":\"%s\",\"type\":\"transactional\"}",
                escapeJson(recipient),
                escapeJson(content)
            );

            HttpRequest request = HttpRequest.newBuilder()
                    .uri(URI.create("https://api.brevo.com/v3/transactionalSMS/sms"))
                    .timeout(Duration.ofSeconds(8))
                    .header("api-key", brevoApiKey.trim())
                    .header("Content-Type", "application/json")
                    .header("Accept", "application/json")
                    .POST(HttpRequest.BodyPublishers.ofString(jsonPayload))
                    .build();

            HttpResponse<String> response = httpClient.send(request, HttpResponse.BodyHandlers.ofString());

            if (response.statusCode() == 200 || response.statusCode() == 201) {
                System.out.println("✅ [REAL SMS SENT VIA BREVO] Successfully delivered to + " + recipient);
                return true;
            } else {
                System.err.println("⚠️ [BREVO SMS NOTICE] Status: " + response.statusCode() + " | Body: " + response.body());
                return false;
            }
        } catch (Exception e) {
            System.err.println("❌ [BREVO SMS EXCEPTION] " + e.getMessage());
            return false;
        }
    }

    private boolean sendViaFast2Sms(String cleanPhone, String otp) {
        try {
            String jsonPayload = String.format(
                "{\"route\":\"otp\",\"variables_values\":\"%s\",\"numbers\":\"%s\"}",
                escapeJson(otp),
                escapeJson(cleanPhone)
            );

            HttpRequest request = HttpRequest.newBuilder()
                    .uri(URI.create("https://www.fast2sms.com/dev/bulkV2"))
                    .timeout(Duration.ofSeconds(8))
                    .header("authorization", fast2smsApiKey.trim())
                    .header("Content-Type", "application/json")
                    .POST(HttpRequest.BodyPublishers.ofString(jsonPayload))
                    .build();

            HttpResponse<String> response = httpClient.send(request, HttpResponse.BodyHandlers.ofString());

            if (response.statusCode() == 200 && response.body().contains("\"return\":true")) {
                System.out.println("✅ [REAL SMS SENT VIA FAST2SMS] Delivered to SIM: +91 " + cleanPhone);
                return true;
            } else {
                System.err.println("⚠️ [FAST2SMS NOTICE] " + response.body());
                return false;
            }
        } catch (Exception e) {
            System.err.println("❌ [FAST2SMS EXCEPTION] " + e.getMessage());
            return false;
        }
    }

    private String escapeJson(String s) {
        if (s == null) return "";
        return s.replace("\\", "\\\\")
                .replace("\"", "\\\"")
                .replace("\b", "\\b")
                .replace("\f", "\\f")
                .replace("\n", "\\n")
                .replace("\r", "\\r")
                .replace("\t", "\\t");
    }
}
