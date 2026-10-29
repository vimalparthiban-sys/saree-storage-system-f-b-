package com.appzys.ecommerce.service;

import jakarta.mail.internet.MimeMessage;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

@Service
public class EmailService {

    @Autowired(required = false)
    private JavaMailSender mailSender;

    @Value("${spring.mail.username:support@appzys.com}")
    private String senderEmail;

    /**
     * Sends a real HTML OTP email to the user's Gmail/Email address.
     * With High Priority headers so Android / iOS pushes immediate status bar notification!
     */
    public boolean sendOtpEmail(String recipientEmail, String otp, String userName) {
        String displayName = (userName != null && !userName.isBlank()) ? userName : "Valued Customer";

        String htmlContent = """
            <!DOCTYPE html>
            <html>
            <head>
              <meta charset="utf-8">
              <style>
                body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #f1f5f9; margin: 0; padding: 20px; }
                .card { max-width: 480px; margin: 0 auto; background: #ffffff; border-radius: 20px; border: 1px solid #e2e8f0; overflow: hidden; box-shadow: 0 10px 15px -3px rgba(0,0,0,0.07); }
                .header { background: linear-gradient(135deg, #1c2d4a 0%%, #0f172a 100%%); padding: 28px 24px; text-align: center; }
                .logo-badge { display: inline-flex; align-items: center; justify-content: center; width: 48px; height: 48px; background-color: #2563eb; color: #ffffff; border-radius: 14px; font-size: 24px; font-weight: 900; margin-bottom: 12px; box-shadow: 0 4px 6px rgba(0,0,0,0.2); }
                .header h1 { color: #ffffff; margin: 0; font-size: 22px; font-weight: 800; letter-spacing: 0.5px; }
                .header p { color: #94a3b8; margin: 4px 0 0 0; font-size: 11px; }
                .content { padding: 32px 24px; text-align: center; }
                .greeting { font-size: 16px; color: #1e293b; margin-bottom: 8px; font-weight: 700; }
                .text { font-size: 13px; color: #64748b; line-height: 1.5; margin-bottom: 24px; }
                .otp-box { display: inline-block; background-color: #f8fafc; border: 2px dashed #1c2d4a; border-radius: 14px; padding: 16px 32px; letter-spacing: 12px; font-family: monospace; font-size: 32px; font-weight: 900; color: #1c2d4a; margin-bottom: 24px; }
                .warning { font-size: 11px; color: #dc2626; background: #fef2f2; padding: 12px 16px; border-radius: 10px; border: 1px solid #fee2e2; margin-bottom: 24px; }
                .footer { background-color: #f8fafc; padding: 16px; text-align: center; font-size: 10px; color: #94a3b8; border-top: 1px solid #e2e8f0; }
              </style>
            </head>
            <body>
              <div class="card">
                <div class="header">
                  <div class="logo-badge">A</div>
                  <h1>APPZYS</h1>
                  <p>Smart Storage Solutions &amp; E-Commerce</p>
                </div>
                <div class="content">
                  <div class="greeting">Hello %s,</div>
                  <div class="text">We received a request to reset your password. Use the verification code below to complete your verification:</div>
                  <div class="otp-box">%s</div>
                  <div class="warning">🔒 This OTP is valid for 10 minutes. For your security, never share this code with anyone.</div>
                  <p style="font-size: 11px; color: #94a3b8; margin: 0;">If you did not request this, please ignore this email.</p>
                </div>
                <div class="footer">
                  © 2026 APPZYS D2C Storage Solutions. All rights reserved.
                </div>
              </div>
            </body>
            </html>
            """.formatted(displayName, otp);

        try {
            if (mailSender == null) {
                System.out.println("⚠️ [EMAIL SERVICE] JavaMailSender not configured. Email logged to console.");
                return false;
            }

            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");

            // High priority headers for immediate Android / iOS status bar notification
            helper.setPriority(1); // 1 = Highest
            message.addHeader("X-Priority", "1");
            message.addHeader("Priority", "Urgent");
            message.addHeader("Importance", "high");
            message.addHeader("X-MSMail-Priority", "High");

            helper.setFrom(senderEmail, "APPZYS Store Security");
            helper.setTo(recipientEmail);
            helper.setSubject("Your APPZYS Verification Code: " + otp);
            helper.setText(htmlContent, true); // true = HTML email

            mailSender.send(message);

            System.out.println("==================================================================");
            System.out.println("✅ [REAL EMAIL DISPATCHED] Real email successfully sent to: " + recipientEmail);
            System.out.println("📱 [PHONE NOTIFICATION] Google Gmail server will push alert to recipient's phone!");
            System.out.println("==================================================================");
            return true;
        } catch (Exception e) {
            System.err.println("❌ [EMAIL DISPATCH ERROR] Could not send email: " + e.getMessage());
            System.err.println("💡 [HELP] To enable real delivery, make sure Gmail App Password is configured in application.properties.");
            return false;
        }
    }
}
