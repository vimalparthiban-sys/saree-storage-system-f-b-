package com.appzys.ecommerce;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class AppzysEcommerceApplication {

    public static void main(String[] args) {
        SpringApplication.run(AppzysEcommerceApplication.class, args);
        System.out.println("=================================================");
        System.out.println("  APPZYS E-COMMERCE BACKEND IS RUNNING ON 8080!  ");
        System.out.println("  Health Check: http://localhost:8080/api/health ");
        System.out.println("=================================================");
    }
}
