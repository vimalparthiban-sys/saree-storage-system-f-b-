package com.appzys.ecommerce.service;

import com.appzys.ecommerce.dto.ForgotPasswordRequest;
import com.appzys.ecommerce.dto.LoginRequest;
import com.appzys.ecommerce.dto.RegisterRequest;
import com.appzys.ecommerce.dto.VerifyOtpRequest;
import com.appzys.ecommerce.entity.User;
import com.appzys.ecommerce.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.Random;

@Service
public class AuthService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private EmailService emailService;

    @Autowired
    private SmsService smsService;

    public User register(RegisterRequest req) {
        String email = req.getEmail().trim().toLowerCase();
        String phone = req.getPhone().trim().replaceAll("[^0-9]", "");

        if (userRepository.existsByEmail(email)) {
            throw new IllegalArgumentException("An account with this email already exists.");
        }
        if (userRepository.existsByPhone(phone)) {
            throw new IllegalArgumentException("An account with this phone number already exists.");
        }

        User user = new User(
            req.getName().trim(),
            phone,
            email,
            req.getPassword().trim(),
            req.getGender()
        );
        return userRepository.save(user);
    }

    public User login(LoginRequest req) {
        String id = req.getIdentifier().trim();
        Optional<User> userOpt = id.contains("@") 
            ? userRepository.findByEmail(id.toLowerCase())
            : userRepository.findByPhone(id.replaceAll("[^0-9]", ""));

        if (userOpt.isEmpty()) {
            throw new IllegalArgumentException("Wrong password or email");
        }

        User user = userOpt.get();
        if (!user.getPassword().equals(req.getPassword().trim())) {
            throw new IllegalArgumentException("Wrong password or email");
        }

        return user;
    }

    public Map<String, String> sendOtp(ForgotPasswordRequest req) {
        String id = req.getIdentifier().trim();
        Optional<User> userOpt = id.contains("@") 
            ? userRepository.findByEmail(id.toLowerCase())
            : userRepository.findByPhone(id.replaceAll("[^0-9]", ""));

        if (userOpt.isEmpty()) {
            throw new IllegalArgumentException("No account registered with this email or phone.");
        }

        User user = userOpt.get();
        // Generate a 4-digit OTP
        String otp = String.format("%04d", new Random().nextInt(10000));
        user.setOtp(otp);
        user.setOtpExpiry(LocalDateTime.now().plusMinutes(10));
        userRepository.save(user);

        String channel = (req.getChannel() != null && !req.getChannel().isBlank())
            ? req.getChannel().trim().toUpperCase()
            : (id.contains("@") ? "EMAIL" : "WHATSAPP");

        String waLink = "";
        String cleanPhone = (user.getPhone() != null) ? user.getPhone().replaceAll("[^0-9]", "") : "";
        if (!cleanPhone.isBlank()) {
            waLink = "https://api.whatsapp.com/send?phone=91" + cleanPhone + "&text=" + 
                     URLEncoder.encode("Your APPZYS verification code is: " + otp + ". Valid for 10 minutes.", StandardCharsets.UTF_8);
        }

        System.out.println("=================================================");
        System.out.println("🔔 [CHANNEL: " + channel + "] Generating OTP: " + otp + " for " + user.getName());

        String message = "OTP generated successfully!";

        if ("WHATSAPP".equalsIgnoreCase(channel)) {
            message = "WhatsApp OTP dispatched directly to your WhatsApp!";
            System.out.println("💬 [WHATSAPP CHANNEL SELECTED] Dispatching via Green-API...");
            if (!cleanPhone.isBlank()) {
                smsService.sendWhatsAppOtp(cleanPhone, otp);
            }
        } else if ("SMS".equalsIgnoreCase(channel)) {
            message = "SMS OTP dispatched to your SIM card via TextBee!";
            if (!cleanPhone.isBlank()) {
                System.out.println("📱 [TEXTBEE SMS DISPATCH] Sending to +91 " + cleanPhone);
                smsService.sendOtpSms(cleanPhone, otp);
            }
        } else {
            message = "Email OTP dispatched to your inbox via Brevo!";
            if (user.getEmail() != null && !user.getEmail().isBlank()) {
                System.out.println("📧 [BREVO EMAIL DISPATCH] Sending to " + user.getEmail());
                emailService.sendOtpEmail(user.getEmail(), otp, user.getName());
            }
        }
        System.out.println("=================================================");

        Map<String, String> result = new HashMap<>();
        result.put("otp", otp);
        result.put("channel", channel);
        result.put("message", message);
        result.put("whatsappUrl", waLink);
        result.put("phone", cleanPhone);
        result.put("email", user.getEmail());
        return result;
    }

    public boolean validateOtp(String identifier, String otp) {
        String id = identifier.trim();
        Optional<User> userOpt = id.contains("@") 
            ? userRepository.findByEmail(id.toLowerCase())
            : userRepository.findByPhone(id.replaceAll("[^0-9]", ""));

        if (userOpt.isEmpty()) {
            throw new IllegalArgumentException("Account not found.");
        }

        User user = userOpt.get();
        if (user.getOtp() == null || !user.getOtp().equals(otp.trim())) {
            throw new IllegalArgumentException("Invalid OTP. Please check the 4-digit code.");
        }

        if (user.getOtpExpiry() != null && user.getOtpExpiry().isBefore(LocalDateTime.now())) {
            throw new IllegalArgumentException("OTP has expired. Please request a new code.");
        }

        return true;
    }

    public User verifyOtpAndResetPassword(VerifyOtpRequest req) {
        String id = req.getIdentifier().trim();
        Optional<User> userOpt = id.contains("@") 
            ? userRepository.findByEmail(id.toLowerCase())
            : userRepository.findByPhone(id.replaceAll("[^0-9]", ""));

        if (userOpt.isEmpty()) {
            throw new IllegalArgumentException("Account not found.");
        }

        User user = userOpt.get();
        if (user.getOtp() == null || !user.getOtp().equals(req.getOtp().trim())) {
            throw new IllegalArgumentException("Invalid OTP. Please check the 4-digit code.");
        }

        if (user.getOtpExpiry() != null && user.getOtpExpiry().isBefore(LocalDateTime.now())) {
            throw new IllegalArgumentException("OTP has expired. Please request a new code.");
        }

        if (req.getNewPassword() != null && !req.getNewPassword().trim().isEmpty()) {
            user.setPassword(req.getNewPassword().trim());
        }

        // Clear OTP after successful reset
        user.setOtp(null);
        user.setOtpExpiry(null);
        return userRepository.save(user);
    }

    public List<User> getAllUsers() {
        return userRepository.findAll();
    }
}
