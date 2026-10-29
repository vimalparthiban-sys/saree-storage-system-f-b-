package com.appzys.ecommerce.service;

import com.appzys.ecommerce.dto.ForgotPasswordRequest;
import com.appzys.ecommerce.dto.LoginRequest;
import com.appzys.ecommerce.dto.RegisterRequest;
import com.appzys.ecommerce.dto.VerifyOtpRequest;
import com.appzys.ecommerce.entity.User;
import com.appzys.ecommerce.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
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

    public String sendOtp(ForgotPasswordRequest req) {
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

        System.out.println("=================================================");
        System.out.println("🔔 [MULTI-CHANNEL OTP DISPATCH] Generating OTP: " + otp + " for " + user.getName());

        // 1. Dispatch Email OTP via Brevo HTTPS (Port 443)
        if (user.getEmail() != null && !user.getEmail().isBlank()) {
            System.out.println("📧 [BREVO EMAIL] Sending OTP to: " + user.getEmail());
            emailService.sendOtpEmail(user.getEmail(), otp, user.getName());
        }

        // 2. Dispatch Cellular SMS OTP via Brevo SMS / Fast2SMS
        if (user.getPhone() != null && !user.getPhone().isBlank()) {
            System.out.println("📱 [CELLULAR SMS] Sending OTP to SIM: +91 " + user.getPhone());
            smsService.sendOtpSms(user.getPhone(), otp);
        }

        // 3. Log WhatsApp Notification Channel
        if (user.getPhone() != null && !user.getPhone().isBlank()) {
            String waLink = "https://wa.me/91" + user.getPhone() + "?text=" + java.net.URLEncoder.encode("Your APPZYS verification code is: " + otp, java.nio.charset.StandardCharsets.UTF_8);
            System.out.println("💬 [WHATSAPP CHANNEL READY] Direct verification link: " + waLink);
        }
        System.out.println("=================================================");

        return otp;
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
