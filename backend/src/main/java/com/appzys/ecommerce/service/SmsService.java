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

    @Value("${TEXTBEE_API_KEY:txb_O1lnP7GoeOKW9wvnWPJ6bagEHBcCeNBx}")
    private String textbeeApiKey;

    @Value("${TEXTBEE_DEVICE_ID:6ae3470ac1ee0a8dece38ed2}")
    private String textbeeDeviceId;

    @Value("${GREEN_API_URL:https://7107.api.greenapi.com}")
    private String greenApiUrl;

    @Value("${GREEN_API_ID_INSTANCE:710722784914}")
    private String greenApiIdInstance;

    @Value("${GREEN_API_TOKEN:1b0e4b723b9149bfbf7e6eea99a2b1758932f1361c584dfe9a}")
    private String greenApiToken;

    @Value("${BREVO_API_KEY:}")
    private String brevoApiKey;

    private final HttpClient httpClient = HttpClient.newBuilder()
            .connectTimeout(Duration.ofSeconds(10))
            .build();

    /**
     * Sends a real SIM SMS to Google Messages app via TextBee Android Gateway (Zero cost).
     * Dispatches through your registered OPPO Android phone.
     */
    public boolean sendOtpSms(String rawPhoneNumber, String otp) {
        String cleanPhone = rawPhoneNumber.replaceAll("[^0-9]", "");
        if (cleanPhone.length() == 12 && cleanPhone.startsWith("91")) {
            cleanPhone = cleanPhone.substring(2);
        }

        String recipientWithPlusCountry = "+91" + cleanPhone;

        System.out.println("==================================================================");
        System.out.println("📱 [TEXTBEE REAL SMS DISPATCH] Target Mobile: " + recipientWithPlusCountry);
        System.out.println("🔑 [OTP CODE] " + otp);
        System.out.println("📱 [DEVICE ID] " + textbeeDeviceId);
        System.out.println("==================================================================");

        try {
            String content = "Your APPZYS verification code is " + otp + ". Valid for 10 minutes.";
            String jsonPayload = String.format(
                "{\"deviceId\":\"%s\",\"recipients\":[\"%s\"],\"message\":\"%s\"}",
                escapeJson(textbeeDeviceId),
                escapeJson(recipientWithPlusCountry),
                escapeJson(content)
            );

            HttpRequest request = HttpRequest.newBuilder()
                    .uri(URI.create("https://api.textbee.dev/api/v1/gateway/send-sms"))
                    .timeout(Duration.ofSeconds(10))
                    .header("x-api-key", textbeeApiKey.trim())
                    .header("Content-Type", "application/json")
                    .header("Accept", "application/json")
                    .POST(HttpRequest.BodyPublishers.ofString(jsonPayload))
                    .build();

            HttpResponse<String> response = httpClient.send(request, HttpResponse.BodyHandlers.ofString());

            System.out.println("📱 [TEXTBEE RESPONSE STATUS]: " + response.statusCode());
            System.out.println("📱 [TEXTBEE RESPONSE BODY]: " + response.body());

            if (response.statusCode() == 200 || response.statusCode() == 201) {
                System.out.println("✅ [REAL SIM SMS DELIVERED VIA TEXTBEE] Target: " + recipientWithPlusCountry);
                return true;
            }
        } catch (Exception e) {
            System.err.println("❌ [TEXTBEE EXCEPTION] " + e.getMessage());
        }

        return false;
    }

    /**
     * Sends a real incoming WhatsApp message directly to customer's WhatsApp via Green-API (Zero cost).
     * Arrives with push notification & sound (Facebook style).
     */
    public boolean sendWhatsAppOtp(String rawPhoneNumber, String otp) {
        String cleanPhone = rawPhoneNumber.replaceAll("[^0-9]", "");
        if (cleanPhone.length() == 12 && cleanPhone.startsWith("91")) {
            cleanPhone = cleanPhone.substring(2);
        }

        String chatId = "91" + cleanPhone + "@c.us";

        System.out.println("==================================================================");
        System.out.println("💬 [GREEN-API WHATSAPP DISPATCH] Target WhatsApp: " + chatId);
        System.out.println("🔑 [OTP CODE] " + otp);
        System.out.println("==================================================================");

        try {
            String url = String.format("%s/waInstance%s/sendMessage/%s",
                    greenApiUrl.replaceAll("/+$", ""),
                    greenApiIdInstance.trim(),
                    greenApiToken.trim());

            String message = "Your APPZYS verification code is: " + otp + ". Valid for 10 minutes.";
            String jsonPayload = String.format(
                "{\"chatId\":\"%s\",\"message\":\"%s\"}",
                escapeJson(chatId),
                escapeJson(message)
            );

            HttpRequest request = HttpRequest.newBuilder()
                    .uri(URI.create(url))
                    .timeout(Duration.ofSeconds(10))
                    .header("Content-Type", "application/json")
                    .header("Accept", "application/json")
                    .POST(HttpRequest.BodyPublishers.ofString(jsonPayload))
                    .build();

            HttpResponse<String> response = httpClient.send(request, HttpResponse.BodyHandlers.ofString());

            System.out.println("💬 [GREEN-API RESPONSE STATUS]: " + response.statusCode());
            System.out.println("💬 [GREEN-API RESPONSE BODY]: " + response.body());

            if (response.statusCode() == 200 || response.statusCode() == 201) {
                System.out.println("✅ [REAL WHATSAPP DELIVERED VIA GREEN-API] Target: " + chatId);
                return true;
            }
        } catch (Exception e) {
            System.err.println("❌ [GREEN-API EXCEPTION] " + e.getMessage());
        }

        return false;
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
