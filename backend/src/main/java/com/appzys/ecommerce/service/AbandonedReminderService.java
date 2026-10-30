package com.appzys.ecommerce.service;

import com.appzys.ecommerce.dto.ProductTrackRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Map;
import java.util.concurrent.*;

@Service
public class AbandonedReminderService {

    @Autowired
    private SmsService smsService;

    private final ScheduledExecutorService scheduler = Executors.newScheduledThreadPool(2);

    // Key: cleanPhone + "_" + productId -> ReminderTask
    private final Map<String, ReminderTask> pendingReminders = new ConcurrentHashMap<>();

    // Keep track of recently placed orders (phone -> timestamp) to suppress reminders
    private final Map<String, Long> completedOrdersPhoneTimestamp = new ConcurrentHashMap<>();

    private static class ReminderTask {
        final ProductTrackRequest request;
        final ScheduledFuture<?> future;
        volatile boolean isCart;

        ReminderTask(ProductTrackRequest request, ScheduledFuture<?> future, boolean isCart) {
            this.request = request;
            this.future = future;
            this.isCart = isCart;
        }
    }

    private String sanitizePhone(String raw) {
        if (raw == null) return "";
        String clean = raw.replaceAll("[^0-9]", "");
        if (clean.length() == 12 && clean.startsWith("91")) {
            return clean.substring(2);
        }
        return clean;
    }

    /**
     * Schedules a WhatsApp reminder 5 minutes after a user views a product or adds to cart.
     * If user later adds to cart, the existing view reminder is upgraded to a cart reminder.
     * Only 1 single message will be sent (no duplicates).
     */
    public void scheduleReminder(ProductTrackRequest req) {
        if (req == null || req.getPhone() == null || req.getPhone().isBlank()) {
            return;
        }

        final String cleanPhone = sanitizePhone(req.getPhone());
        if (cleanPhone.isBlank()) return;

        // Suppress if order was placed within the last 2 hours
        Long lastOrderTime = completedOrdersPhoneTimestamp.get(cleanPhone);
        if (lastOrderTime != null && (System.currentTimeMillis() - lastOrderTime) < 7200000L) {
            System.out.println("ℹ️ [REMINDER SUPPRESSED] Customer " + cleanPhone + " recently placed an order.");
            return;
        }

        String prodId = (req.getProductId() != null && !req.getProductId().isBlank()) ? req.getProductId() : "saree-organiser";
        final String key = cleanPhone + "_" + prodId;
        boolean isNewCart = Boolean.TRUE.equals(req.getIsCart());

        ReminderTask existing = pendingReminders.get(key);
        if (existing != null) {
            // If already scheduled as view, but user now added to cart -> upgrade to Cart reminder!
            if (isNewCart && !existing.isCart) {
                existing.isCart = true;
                existing.request.setIsCart(true);
                System.out.println("🛒 [REMINDER UPGRADED TO CART] Phone: " + cleanPhone + " | Product: " + prodId);
            }
            return;
        }

        // Schedule dispatch after exactly 5 minutes (300 seconds)
        ScheduledFuture<?> future = scheduler.schedule(() -> {
            try {
                ReminderTask task = pendingReminders.remove(key);
                if (task != null) {
                    // Safety check: verify no order was placed in the meantime
                    Long orderTime = completedOrdersPhoneTimestamp.get(cleanPhone);
                    if (orderTime != null && (System.currentTimeMillis() - orderTime) < 7200000L) {
                        System.out.println("ℹ️ [REMINDER CANCELLED BEFORE DISPATCH] Customer placed an order: " + cleanPhone);
                        return;
                    }

                    ProductTrackRequest r = task.request;
                    System.out.println("⏰ [5-MIN REMINDER FIRING NOW] Target: " + cleanPhone + " | isCart: " + task.isCart);
                    smsService.sendWhatsAppProductReminder(
                        cleanPhone,
                        r.getCustomerName(),
                        r.getProductId(),
                        r.getProductTitle(),
                        r.getPrice(),
                        r.getImageUrl(),
                        task.isCart
                    );
                }
            } catch (Exception e) {
                System.err.println("❌ [REMINDER EXECUTION ERROR] " + e.getMessage());
            }
        }, 5, TimeUnit.MINUTES);

        pendingReminders.put(key, new ReminderTask(req, future, isNewCart));
        System.out.println("⏳ [REMINDER REGISTERED] Key: " + key + " (isCart=" + isNewCart + "). WhatsApp will arrive in 5 mins even if user closes the browser.");
    }

    /**
     * Cancels any pending reminders when an order is completed.
     */
    public void cancelRemindersForPhone(String rawPhone) {
        if (rawPhone == null || rawPhone.isBlank()) return;

        final String cleanPhone = sanitizePhone(rawPhone);
        if (cleanPhone.isBlank()) return;

        completedOrdersPhoneTimestamp.put(cleanPhone, System.currentTimeMillis());

        pendingReminders.keySet().removeIf(k -> {
            if (k.startsWith(cleanPhone + "_")) {
                ReminderTask task = pendingReminders.get(k);
                if (task != null && task.future != null) {
                    task.future.cancel(false);
                }
                System.out.println("🛑 [CANCELLED PENDING REMINDER] Order placed by customer: " + cleanPhone);
                return true;
            }
            return false;
        });
    }
}
