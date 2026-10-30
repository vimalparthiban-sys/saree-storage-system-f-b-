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

    @Value("${textbee.api.key:${TEXTBEE_API_KEY:txb_O1lnP7GoeOKW9wvnWPJ6bagEHBcCeNBx}}")
    private String textbeeApiKey;

    @Value("${textbee.device.id:${TEXTBEE_DEVICE_ID:6ae3470ac1ee0a8dece38ed2}}")
    private String textbeeDeviceId;

    @Value("${greenapi.url:${GREEN_API_URL:https://7107.api.greenapi.com}}")
    private String greenApiUrl;

    @Value("${greenapi.id-instance:${GREEN_API_ID_INSTANCE:710722784914}}")
    private String greenApiIdInstance;

    @Value("${greenapi.token:${GREEN_API_TOKEN:1b0e4b723b9149bfbf7e6eea99a2b1758932f1361c584dfe9a}}")
    private String greenApiToken;

    @Value("${brevo.api.key:${BREVO_API_KEY:}}")
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

    /**
     * Overload for backwards compatibility
     */
    public boolean sendWhatsAppOrderConfirmation(String rawPhoneNumber, String customerName, String orderId, String awbCode, Number totalAmount, String firstItemTitle) {
        return sendWhatsAppOrderConfirmation(rawPhoneNumber, customerName, orderId, awbCode, totalAmount, firstItemTitle, null, null);
    }

    /**
     * Sends a real incoming WhatsApp Order Confirmation WITH PRODUCT PHOTO directly to customer's WhatsApp via Green-API (Zero cost).
     * Includes selected Color, AWB code, Amount, and live tracking link.
     */
    public boolean sendWhatsAppOrderConfirmation(
            String rawPhoneNumber,
            String customerName,
            String orderId,
            String awbCode,
            Number totalAmount,
            String firstItemTitle,
            String itemColor,
            String imageUrl
    ) {
        String cleanPhone = rawPhoneNumber.replaceAll("[^0-9]", "");
        if (cleanPhone.length() == 12 && cleanPhone.startsWith("91")) {
            cleanPhone = cleanPhone.substring(2);
        }

        String chatId = "91" + cleanPhone + "@c.us";
        String name = (customerName != null && !customerName.isBlank()) ? customerName.trim() : "Customer";
        String trackingLink = "https://saree-storage-system-f-b.onrender.com/track-order?query=" + awbCode;

        StringBuilder sb = new StringBuilder();
        sb.append("Vanakkam ").append(name).append("!\n\n");
        sb.append("Your order *#").append(orderId).append("* has been successfully received & confirmed at *APPZYS Smart Storage*!\n\n");
        if (firstItemTitle != null && !firstItemTitle.isBlank()) {
            sb.append("📦 *Items:* ").append(firstItemTitle).append("\n");
        }
        if (itemColor != null && !itemColor.isBlank() && !"Standard".equalsIgnoreCase(itemColor.trim())) {
            sb.append("🎨 *Color:* ").append(itemColor.trim()).append("\n");
        }
        sb.append("💰 *Amount:* ₹").append(totalAmount != null ? totalAmount.intValue() : 0).append(" (COD)\n");
        sb.append("🚚 *Courier:* Delhivery Express\n");
        sb.append("🏷️ *AWB Code:* ").append(awbCode).append("\n\n");
        sb.append("Our Chennai central fulfillment team is now packing your box with high-durability stainless steel rods.\n\n");
        sb.append("🔗 *Live Track Your Order:*\n").append(trackingLink);

        String message = sb.toString();

        System.out.println("==================================================================");
        System.out.println("💬 [GREEN-API WHATSAPP ORDER DISPATCH] Target WhatsApp: " + chatId);
        System.out.println("📦 [ORDER ID] " + orderId + " | [COLOR] " + itemColor + " | [AWB] " + awbCode);
        if (imageUrl != null) System.out.println("📸 [PRODUCT IMAGE] " + imageUrl);
        System.out.println("==================================================================");

        // Try sending with product photo first if imageUrl is available
        if (imageUrl != null && !imageUrl.isBlank()) {
            try {
                String sendFileUrl = String.format("%s/waInstance%s/sendFileByUrl/%s",
                        greenApiUrl.replaceAll("/+$", ""),
                        greenApiIdInstance.trim(),
                        greenApiToken.trim());

                String jsonPayload = String.format(
                    "{\"chatId\":\"%s\",\"urlFile\":\"%s\",\"fileName\":\"order_confirmed.jpg\",\"caption\":\"%s\"}",
                    escapeJson(chatId),
                    escapeJson(imageUrl),
                    escapeJson(message)
                );

                HttpRequest request = HttpRequest.newBuilder()
                        .uri(URI.create(sendFileUrl))
                        .timeout(Duration.ofSeconds(12))
                        .header("Content-Type", "application/json")
                        .header("Accept", "application/json")
                        .POST(HttpRequest.BodyPublishers.ofString(jsonPayload))
                        .build();

                HttpResponse<String> response = httpClient.send(request, HttpResponse.BodyHandlers.ofString());

                System.out.println("📸 [GREEN-API ORDER PHOTO RESPONSE STATUS]: " + response.statusCode());
                System.out.println("📸 [GREEN-API ORDER PHOTO RESPONSE BODY]: " + response.body());

                if (response.statusCode() == 200 || response.statusCode() == 201) {
                    System.out.println("✅ [REAL ORDER CONFIRMATION PHOTO DELIVERED VIA WHATSAPP] Target: " + chatId);
                    return true;
                } else {
                    System.err.println("⚠️ [ORDER PHOTO DISPATCH FAILED, FALLING BACK TO TEXT]");
                }
            } catch (Exception e) {
                System.err.println("⚠️ [ORDER PHOTO DISPATCH EXCEPTION, FALLING BACK TO TEXT] " + e.getMessage());
            }
        }

        // Fallback to text sendMessage
        try {
            String url = String.format("%s/waInstance%s/sendMessage/%s",
                    greenApiUrl.replaceAll("/+$", ""),
                    greenApiIdInstance.trim(),
                    greenApiToken.trim());

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

            System.out.println("💬 [GREEN-API ORDER DISPATCH STATUS]: " + response.statusCode());
            System.out.println("💬 [GREEN-API ORDER DISPATCH BODY]: " + response.body());

            if (response.statusCode() == 200 || response.statusCode() == 201) {
                System.out.println("✅ [REAL ORDER CONFIRMATION SENT VIA WHATSAPP] Target: " + chatId);
                return true;
            }
        } catch (Exception e) {
            System.err.println("❌ [GREEN-API ORDER DISPATCH EXCEPTION] " + e.getMessage());
        }

        return false;
    }

    /**
     * Sends an Abandoned Cart / Viewed Product reminder WITH REAL IMAGE via Green-API (Zero cost).
     * Image appears prominently on customer's WhatsApp like Homestrap/IndiaMART!
     */
    public boolean sendWhatsAppProductReminder(String rawPhoneNumber, String customerName, String productId, String productTitle, Integer price, String imageUrl, boolean isCartAbandoned) {
        String cleanPhone = rawPhoneNumber.replaceAll("[^0-9]", "");
        if (cleanPhone.length() == 12 && cleanPhone.startsWith("91")) {
            cleanPhone = cleanPhone.substring(2);
        }

        String chatId = "91" + cleanPhone + "@c.us";
        String name = (customerName != null && !customerName.isBlank()) ? customerName.trim() : "Friend";
        String productLink = "https://saree-storage-system-f-b.onrender.com/product/" + (productId != null ? productId : "saree-organiser");

        StringBuilder sb = new StringBuilder();
        sb.append("Vanakkam ").append(name).append("! 👋\n\n");
        if (isCartAbandoned) {
            sb.append("Hey there, we noticed you left *").append(productTitle).append("* in your cart 🛍️\n\n");
            sb.append("Still thinking it over? It's waiting for you! Don't miss out on your order.\n\n");
        } else {
            sb.append("We noticed you were checking out *").append(productTitle).append("* at APPZYS Smart Storage 🛍️\n\n");
            sb.append("Still thinking it over? Stocks are moving fast!\n\n");
        }
        sb.append("💰 *Special Price:* ₹").append(price != null ? price : 499).append(" (COD Available)\n");
        sb.append("🚚 *Delivery:* Express Courier Across India\n\n");
        sb.append("👉 *Complete Your Order Here:*\n").append(productLink);

        String caption = sb.toString();

        System.out.println("==================================================================");
        System.out.println("📸 [GREEN-API WHATSAPP " + (isCartAbandoned ? "CART" : "VIEW") + " REMINDER] Target: " + chatId);
        System.out.println("📦 [PRODUCT] " + productTitle + " | [IMG] " + imageUrl);
        System.out.println("==================================================================");

        try {
            String url = String.format("%s/waInstance%s/sendFileByUrl/%s",
                    greenApiUrl.replaceAll("/+$", ""),
                    greenApiIdInstance.trim(),
                    greenApiToken.trim());

            String jsonPayload = String.format(
                "{\"chatId\":\"%s\",\"urlFile\":\"%s\",\"fileName\":\"product.jpg\",\"caption\":\"%s\"}",
                escapeJson(chatId),
                escapeJson(imageUrl),
                escapeJson(caption)
            );

            HttpRequest request = HttpRequest.newBuilder()
                    .uri(URI.create(url))
                    .timeout(Duration.ofSeconds(12))
                    .header("Content-Type", "application/json")
                    .header("Accept", "application/json")
                    .POST(HttpRequest.BodyPublishers.ofString(jsonPayload))
                    .build();

            HttpResponse<String> response = httpClient.send(request, HttpResponse.BodyHandlers.ofString());

            System.out.println("📸 [GREEN-API IMAGE RESPONSE STATUS]: " + response.statusCode());
            System.out.println("📸 [GREEN-API IMAGE RESPONSE BODY]: " + response.body());

            if (response.statusCode() == 200 || response.statusCode() == 201) {
                System.out.println("✅ [PRODUCT IMAGE WHATSAPP DELIVERED] Target: " + chatId);
                return true;
            }
        } catch (Exception e) {
            System.err.println("❌ [GREEN-API IMAGE EXCEPTION] " + e.getMessage());
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
