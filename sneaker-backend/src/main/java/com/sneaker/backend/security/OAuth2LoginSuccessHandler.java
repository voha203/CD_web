package com.sneaker.backend.security;

import com.sneaker.backend.entity.User;
import com.sneaker.backend.repository.UserRepository;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.security.web.authentication.AuthenticationSuccessHandler;
import org.springframework.stereotype.Component;
import org.springframework.web.util.UriComponentsBuilder;

import java.io.IOException;
import java.util.Locale;
import java.util.UUID;

@Component
public class OAuth2LoginSuccessHandler implements AuthenticationSuccessHandler {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;

    @Value("${app.oauth2.frontend-redirect-uri:http://localhost:5173/oauth2/redirect}")
    private String frontendRedirectUri;

    public OAuth2LoginSuccessHandler(
            UserRepository userRepository,
            PasswordEncoder passwordEncoder,
            JwtUtil jwtUtil
    ) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtUtil = jwtUtil;
    }

    @Override
    public void onAuthenticationSuccess(
            HttpServletRequest request,
            HttpServletResponse response,
            Authentication authentication
    ) throws IOException, ServletException {
        OAuth2User oAuth2User = (OAuth2User) authentication.getPrincipal();

        String email = normalize(oAuth2User.getAttribute("email"));
        String providerId = normalize(oAuth2User.getAttribute("sub"));
        String fullName = normalize(oAuth2User.getAttribute("name"));
        String avatarUrl = normalize(oAuth2User.getAttribute("picture"));

        if (email == null || providerId == null) {
            redirectWithError(response, "missing_google_profile");
            return;
        }

        User user = userRepository.findByEmail(email)
                .map(existing -> updateExistingGoogleUser(existing, providerId, fullName, avatarUrl))
                .orElseGet(() -> createGoogleUser(email, providerId, fullName, avatarUrl));

        if (Boolean.FALSE.equals(user.getActive())) {
            redirectWithError(response, "account_locked");
            return;
        }

        String token = jwtUtil.generateToken(user.getUsername());
        String targetUrl = UriComponentsBuilder.fromUriString(frontendRedirectUri)
                .queryParam("token", token)
                .build()
                .toUriString();

        response.sendRedirect(targetUrl);
    }

    private User updateExistingGoogleUser(User user, String providerId, String fullName, String avatarUrl) {
        user.setProvider("GOOGLE");
        user.setProviderId(providerId);

        if (fullName != null && !fullName.isBlank()) {
            user.setFullName(fullName);
        }

        if (avatarUrl != null && !avatarUrl.isBlank()) {
            user.setAvatarUrl(avatarUrl);
        }

        if (user.getRole() == null || user.getRole().isBlank()) {
            user.setRole("USER");
        }

        return userRepository.save(user);
    }

    private User createGoogleUser(String email, String providerId, String fullName, String avatarUrl) {
        User user = new User();
        user.setUsername(generateUniqueUsername(email));
        user.setPassword(passwordEncoder.encode(UUID.randomUUID().toString()));
        user.setEmail(email);
        user.setFullName(fullName);
        user.setAvatarUrl(avatarUrl);
        user.setProvider("GOOGLE");
        user.setProviderId(providerId);
        user.setRole("USER");
        user.setActive(true);

        return userRepository.save(user);
    }

    private String generateUniqueUsername(String email) {
        String base = email.substring(0, email.indexOf("@"))
                .toLowerCase(Locale.ROOT)
                .replaceAll("[^a-z0-9_]", "_");

        if (base.isBlank()) {
            base = "google_user";
        }

        String username = base;
        int counter = 1;

        while (userRepository.existsByUsername(username)) {
            username = base + "_" + counter;
            counter++;
        }

        return username;
    }

    private String normalize(String value) {
        if (value == null) {
            return null;
        }

        String trimmed = value.trim();
        return trimmed.isEmpty() ? null : trimmed;
    }

    private void redirectWithError(HttpServletResponse response, String error) throws IOException {
        String targetUrl = UriComponentsBuilder.fromUriString(frontendRedirectUri)
                .queryParam("error", error)
                .build()
                .toUriString();

        response.sendRedirect(targetUrl);
    }
}
