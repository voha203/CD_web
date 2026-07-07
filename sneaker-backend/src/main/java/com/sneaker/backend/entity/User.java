package com.sneaker.backend.entity;

import jakarta.persistence.*;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@Entity
@Table(name = "users")
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String username;
    private String password;
    private String email;
    private String fullName;
    private String phone;
    private String address;
    private String avatarUrl;
    private String provider;
    private String providerId;

    private String role; // USER / ADMIN
    private Boolean active = true;
    private LocalDateTime createdAt;

    @PrePersist
    protected void onCreate() {
        if (this.active == null) {
            this.active = true;
        }
        if (this.createdAt == null) {
            this.createdAt = LocalDateTime.now();
        }
    }
}
