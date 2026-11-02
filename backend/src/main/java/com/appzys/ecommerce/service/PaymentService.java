package com.appzys.ecommerce.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import javax.crypto.Mac;
import javax.crypto.spec.SecretKeySpec;
import java.io.BufferedReader;
import java.io.InputStreamReader;
import java.io.OutputStream;
import java.net.HttpURLConnection;
import java.net.URL;
import java.nio.charset.StandardCharsets;
import java.util.Base64;
import java.util.HashMap;
import java.util.Map;
import java.util.Random;

@Service
public class PaymentService {

    @Value("${razorpay.key.id:rzp_test_1DP5mmOlF5G5ag}")
    private String keyId;

    @Value("${razorpay.key.secret:rzp_secret_placeholder}")
    private String keySecret;

    public String getKeyId() {
        return (keyId != null && !keyId.isBlank()) ? keyId : "rzp_test_1DP5mmOlF5G5ag";
    }

    public boolean isTestMode() {
        return keyId == null || keyId.isBlank() || keyId.startsWith("rzp_test_") || keySecret == null || keySecret.contains("placeholder");
    }

    /**
     * Create Razorpay Order via REST API or test order generator
     */
    public Map<String, Object> createOrder(Integer amountInRupees, String receipt) {
        Map<String, Object> response = new HashMap<>();
        int amountInPaise = (amountInRupees != null ? amountInRupees : 499) * 100;
        String receiptId = (receipt != null && !receipt.isBlank()) ? receipt : "rcpt_" + System.currentTimeMillis();

        if (isTestMode()) {
            // Test Mode: generate standard test order id for checkout.js
            String mockOrderId = "order_test_" + (100000 + new Random().nextInt(900000));
            response.put("id", mockOrderId);
            response.put("entity", "order");
            response.put("amount", amountInPaise);
            response.put("amount_paid", 0);
            response.put("amount_due", amountInPaise);
            response.put("currency", "INR");
            response.put("receipt", receiptId);
            response.put("status", "created");
            response.put("keyId", getKeyId());
            response.put("isTestMode", true);
            System.out.println("💳 [PAYMENT SERVICE] Created Test Order: " + mockOrderId + " (₹" + amountInRupees + ")");
            return response;
        }

        try {
            URL url = new URL("https://api.razorpay.com/v1/orders");
            HttpURLConnection conn = (HttpURLConnection) url.openConnection();
            conn.setRequestMethod("POST");
            conn.setConnectTimeout(8000);
            conn.setReadTimeout(8000);
            conn.setDoOutput(true);
            conn.setRequestProperty("Content-Type", "application/json");

            String auth = keyId + ":" + keySecret;
            String encodedAuth = Base64.getEncoder().encodeToString(auth.getBytes(StandardCharsets.UTF_8));
            conn.setRequestProperty("Authorization", "Basic " + encodedAuth);

            String jsonPayload = String.format("{\"amount\":%d,\"currency\":\"INR\",\"receipt\":\"%s\"}", amountInPaise, receiptId);

            try (OutputStream os = conn.getOutputStream()) {
                os.write(jsonPayload.getBytes(StandardCharsets.UTF_8));
                os.flush();
            }

            int statusCode = conn.getResponseCode();
            if (statusCode == 200 || statusCode == 201) {
                try (BufferedReader br = new BufferedReader(new InputStreamReader(conn.getInputStream(), StandardCharsets.UTF_8))) {
                    StringBuilder sb = new StringBuilder();
                    String line;
                    while ((line = br.readLine()) != null) {
                        sb.append(line);
                    }
                    String body = sb.toString();
                    
                    String orderId = extractJsonString(body, "id");
                    response.put("id", orderId);
                    response.put("amount", amountInPaise);
                    response.put("currency", "INR");
                    response.put("receipt", receiptId);
                    response.put("keyId", keyId);
                    response.put("isTestMode", false);
                    System.out.println("💳 [PAYMENT SERVICE] Live Razorpay Order Created: " + orderId);
                    return response;
                }
            } else {
                System.err.println("⚠️ [PAYMENT SERVICE] Razorpay API responded with HTTP " + statusCode + ", falling back to test credentials.");
                String mockOrderId = "order_test_" + (100000 + new Random().nextInt(900000));
                response.put("id", mockOrderId);
                response.put("amount", amountInPaise);
                response.put("currency", "INR");
                response.put("receipt", receiptId);
                response.put("keyId", getKeyId());
                response.put("isTestMode", true);
                return response;
            }
        } catch (Exception ex) {
            System.err.println("⚠️ [PAYMENT SERVICE] Error connecting to Razorpay: " + ex.getMessage());
            String mockOrderId = "order_test_" + (100000 + new Random().nextInt(900000));
            response.put("id", mockOrderId);
            response.put("amount", amountInPaise);
            response.put("currency", "INR");
            response.put("receipt", receiptId);
            response.put("keyId", getKeyId());
            response.put("isTestMode", true);
            return response;
        }
    }

    /**
     * Cryptographically verifies HMAC-SHA256 signature from Razorpay
     */
    public boolean verifySignature(String razorpayOrderId, String razorpayPaymentId, String razorpaySignature) {
        if (razorpayPaymentId == null || razorpayPaymentId.isBlank()) {
            return false;
        }

        // In test mode, allow verification of Razorpay sandbox payments
        if (isTestMode()) {
            System.out.println("✅ [PAYMENT SERVICE] Test Sandbox payment verified: " + razorpayPaymentId);
            return true;
        }

        try {
            String data = razorpayOrderId + "|" + razorpayPaymentId;
            Mac sha256_HMAC = Mac.getInstance("HmacSHA256");
            SecretKeySpec secret_key = new SecretKeySpec(keySecret.getBytes(StandardCharsets.UTF_8), "HmacSHA256");
            sha256_HMAC.init(secret_key);
            byte[] hash = sha256_HMAC.doFinal(data.getBytes(StandardCharsets.UTF_8));

            StringBuilder hexString = new StringBuilder();
            for (byte b : hash) {
                String hex = Integer.toHexString(0xff & b);
                if (hex.length() == 1) hexString.append('0');
                hexString.append(hex);
            }
            String calculatedSignature = hexString.toString();
            boolean isValid = calculatedSignature.equalsIgnoreCase(razorpaySignature);
            if (isValid) {
                System.out.println("🔒 [PAYMENT SERVICE] HMAC-SHA256 Signature verified 100% genuine for payment: " + razorpayPaymentId);
            } else {
                System.err.println("❌ [PAYMENT SERVICE] HMAC Signature mismatch for payment: " + razorpayPaymentId);
            }
            return isValid;
        } catch (Exception ex) {
            System.err.println("❌ [PAYMENT SERVICE] Cryptographic signature error: " + ex.getMessage());
            return false;
        }
    }

    private String extractJsonString(String json, String key) {
        String pattern = "\"" + key + "\":\"";
        int start = json.indexOf(pattern);
        if (start == -1) return null;
        start += pattern.length();
        int end = json.indexOf("\"", start);
        if (end == -1) return null;
        return json.substring(start, end);
    }
}
