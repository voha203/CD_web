package com.sneaker.backend.config;

import com.sneaker.backend.repository.UserRepository;
import com.sneaker.backend.security.JwtFilter;
import com.sneaker.backend.security.JwtUtil;
import com.sneaker.backend.security.OAuth2LoginSuccessHandler;
import org.springframework.beans.factory.ObjectProvider;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.oauth2.client.registration.ClientRegistrationRepository;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

@Configuration
public class SecurityConfig {

    @Value("${app.oauth2.frontend-login-uri:http://localhost:5173/login}")
    private String frontendLoginUri;

    @Bean
    public JwtFilter jwtFilter(JwtUtil jwtUtil, UserRepository userRepository) {
        return new JwtFilter(jwtUtil, userRepository);
    }

    @Bean
    public SecurityFilterChain filterChain(
            HttpSecurity http,
            JwtFilter jwtFilter,
            OAuth2LoginSuccessHandler oAuth2LoginSuccessHandler,
            ObjectProvider<ClientRegistrationRepository> clientRegistrationRepository
    ) throws Exception {

        http
                .cors(cors -> {})
                .csrf(csrf -> csrf.disable())
                .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.IF_REQUIRED))
                .authorizeHttpRequests(auth -> auth
                        .requestMatchers(
                                "/api/auth/login",
                                "/api/auth/register",
                                "/api/auth/forgot-password",
                                "/api/auth/reset-password",
                                "/oauth2/**",
                                "/login/oauth2/**"
                        ).permitAll()
                        .requestMatchers("/api/auth/profile", "/api/auth/change-password").authenticated()

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
                        .requestMatchers("/api/addresses/**").hasRole("USER")
                        .requestMatchers("/api/wishlist/**").hasRole("USER")
                        .requestMatchers("/api/coupons/validate").hasRole("USER")
                        .requestMatchers(HttpMethod.POST, "/api/products/*/reviews").hasRole("USER")
                        .requestMatchers(HttpMethod.PUT, "/api/reviews/**").hasRole("USER")
                        .requestMatchers(HttpMethod.DELETE, "/api/reviews/**").hasRole("USER")
                        .requestMatchers(HttpMethod.GET, "/api/reviews/can-review/**").hasRole("USER")
                        .requestMatchers("/api/payment/create-url").hasRole("USER")

                        .requestMatchers("/api/admin/**").hasRole("ADMIN")
                        .requestMatchers(HttpMethod.POST, "/api/products/**").hasRole("ADMIN")
                        .requestMatchers(HttpMethod.PUT, "/api/products/**").hasRole("ADMIN")
                        .requestMatchers(HttpMethod.DELETE, "/api/products/**").hasRole("ADMIN")
                        .requestMatchers(HttpMethod.POST, "/api/categories/**").hasRole("ADMIN")
                        .requestMatchers(HttpMethod.PUT, "/api/categories/**").hasRole("ADMIN")
                        .requestMatchers(HttpMethod.DELETE, "/api/categories/**").hasRole("ADMIN")
                        .requestMatchers(HttpMethod.POST, "/api/product-sizes/**").hasRole("ADMIN")

                        .anyRequest().authenticated()
                );

        if (clientRegistrationRepository.getIfAvailable() != null) {
            http.oauth2Login(oauth -> oauth
                    .successHandler(oAuth2LoginSuccessHandler)
                    .failureUrl(frontendLoginUri + "?oauth2Error=true")
            );
        }

        http.addFilterBefore(jwtFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }
}
