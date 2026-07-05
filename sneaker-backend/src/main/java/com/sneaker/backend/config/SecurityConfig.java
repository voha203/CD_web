package com.sneaker.backend.config;

import com.sneaker.backend.repository.UserRepository;
import com.sneaker.backend.security.JwtFilter;
import com.sneaker.backend.security.JwtUtil;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

@Configuration
public class SecurityConfig {

    @Bean
    public JwtFilter jwtFilter(JwtUtil jwtUtil, UserRepository userRepository) {
        return new JwtFilter(jwtUtil, userRepository);
    }

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http, JwtFilter jwtFilter) throws Exception {

        http
                .cors(cors -> {})
                .csrf(csrf -> csrf.disable())
                .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                .authorizeHttpRequests(auth -> auth
                        .requestMatchers("/api/auth/login", "/api/auth/register").permitAll()
                        .requestMatchers("/api/auth/profile").authenticated()

                        .requestMatchers(HttpMethod.GET, "/api/products/**").permitAll()
                        .requestMatchers(HttpMethod.GET, "/api/categories/**").permitAll()
                        .requestMatchers(HttpMethod.GET, "/api/sizes/**").permitAll()
                        .requestMatchers(HttpMethod.GET, "/api/images/**").permitAll()
                        .requestMatchers(HttpMethod.GET, "/api/variants/**").permitAll()
                        .requestMatchers(HttpMethod.GET, "/api/variant-sizes/**").permitAll()
                        .requestMatchers(HttpMethod.GET, "/api/product-sizes/**").permitAll()
                        .requestMatchers(HttpMethod.GET, "/api/discounts/**").permitAll()
                        .requestMatchers(HttpMethod.GET, "/api/payment/vnpay-return", "/api/payment/vnpay-ipn").permitAll()

                        .requestMatchers("/api/cart/**").hasRole("USER")
                        .requestMatchers("/api/orders/**").hasRole("USER")
                        .requestMatchers(HttpMethod.POST, "/api/products/*/reviews").hasRole("USER")
                        .requestMatchers("/api/payment/create-url").hasRole("USER")

                        .requestMatchers(HttpMethod.POST, "/api/products/**").hasRole("ADMIN")
                        .requestMatchers(HttpMethod.PUT, "/api/products/**").hasRole("ADMIN")
                        .requestMatchers(HttpMethod.DELETE, "/api/products/**").hasRole("ADMIN")
                        .requestMatchers(HttpMethod.POST, "/api/categories/**").hasRole("ADMIN")
                        .requestMatchers(HttpMethod.PUT, "/api/categories/**").hasRole("ADMIN")
                        .requestMatchers(HttpMethod.DELETE, "/api/categories/**").hasRole("ADMIN")
                        .requestMatchers(HttpMethod.POST, "/api/discounts/**").hasRole("ADMIN")
                        .requestMatchers(HttpMethod.DELETE, "/api/discounts/**").hasRole("ADMIN")
                        .requestMatchers(HttpMethod.POST, "/api/product-sizes/**").hasRole("ADMIN")

                        .anyRequest().authenticated()
                )
                .addFilterBefore(jwtFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }
}
