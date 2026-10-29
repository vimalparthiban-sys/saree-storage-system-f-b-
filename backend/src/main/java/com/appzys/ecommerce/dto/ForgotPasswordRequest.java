package com.appzys.ecommerce.dto;

public class ForgotPasswordRequest {
    private String identifier; // email or phone

    public String getIdentifier() { return identifier; }
    public void setIdentifier(String identifier) { this.identifier = identifier; }
}
