package com.appzys.ecommerce.dto;

public class ForgotPasswordRequest {
    private String identifier; // email or phone
    private String channel;    // "SMS" | "WHATSAPP" | "EMAIL"

    public String getIdentifier() { return identifier; }
    public void setIdentifier(String identifier) { this.identifier = identifier; }

    public String getChannel() { return channel; }
    public void setChannel(String channel) { this.channel = channel; }
}
