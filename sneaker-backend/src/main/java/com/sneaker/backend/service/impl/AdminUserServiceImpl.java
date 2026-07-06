package com.sneaker.backend.service.impl;

import com.sneaker.backend.dto.admin.AdminUserResponse;
import com.sneaker.backend.entity.User;
import com.sneaker.backend.repository.UserRepository;
import com.sneaker.backend.service.AdminUserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.Comparator;
import java.util.List;
import java.util.Locale;
import java.util.Set;

@Service
public class AdminUserServiceImpl implements AdminUserService {

    private static final Set<String> ROLES = Set.of("USER", "ADMIN");

    @Autowired
    private UserRepository userRepository;

    @Override
    public List<AdminUserResponse> getUsers(String keyword, String role, Boolean active) {
        String normalizedKeyword = keyword == null ? "" : keyword.trim().toLowerCase(Locale.ROOT);
        String normalizedRole = role == null || role.isBlank() || "ALL".equalsIgnoreCase(role)
                ? null
                : normalizeRole(role);

        return userRepository.findAll().stream()
                .filter(user -> normalizedRole == null || normalizedRole.equals(normalizeRole(user.getRole())))
                .filter(user -> active == null || active.equals(!Boolean.FALSE.equals(user.getActive())))
                .filter(user -> matchesKeyword(user, normalizedKeyword))
                .sorted(Comparator.comparing(User::getId, Comparator.nullsLast(Comparator.naturalOrder())).reversed())
                .map(this::toResponse)
                .toList();
    }

    @Override
    public AdminUserResponse getUserById(Long id) {
        return toResponse(findUser(id));
    }

    @Override
    public AdminUserResponse updateStatus(Long id, Boolean active, String currentUsername) {
        User user = findUser(id);

        if (user.getUsername().equals(currentUsername) && Boolean.FALSE.equals(active)) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Admin không thể tự khóa tài khoản của chính mình");
        }

        user.setActive(Boolean.TRUE.equals(active));
        return toResponse(userRepository.save(user));
    }

    @Override
    public AdminUserResponse updateRole(Long id, String role, String currentUsername) {
        User user = findUser(id);
        String normalizedRole = normalizeRole(role);

        if (!ROLES.contains(normalizedRole)) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Vai trò không hợp lệ");
        }

        if (user.getUsername().equals(currentUsername) && !"ADMIN".equals(normalizedRole)) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Admin không thể tự hạ quyền của chính mình");
        }

        user.setRole(normalizedRole);
        return toResponse(userRepository.save(user));
    }

    private boolean matchesKeyword(User user, String keyword) {
        if (keyword.isEmpty()) return true;

        return contains(user.getUsername(), keyword)
                || contains(user.getFullName(), keyword)
                || contains(user.getEmail(), keyword)
                || contains(user.getPhone(), keyword);
    }

    private boolean contains(String value, String keyword) {
        return value != null && value.toLowerCase(Locale.ROOT).contains(keyword);
    }

    private String normalizeRole(String role) {
        if (role == null || role.isBlank()) return "USER";

        String normalized = role.trim().toUpperCase(Locale.ROOT);
        return normalized.startsWith("ROLE_") ? normalized.substring(5) : normalized;
    }

    private User findUser(Long id) {
        return userRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Không tìm thấy user"));
    }

    private AdminUserResponse toResponse(User user) {
        return AdminUserResponse.builder()
                .id(user.getId())
                .username(user.getUsername())
                .email(user.getEmail())
                .fullName(user.getFullName())
                .phone(user.getPhone())
                .address(user.getAddress())
                .avatarUrl(user.getAvatarUrl())
                .role(normalizeRole(user.getRole()))
                .active(!Boolean.FALSE.equals(user.getActive()))
                .createdAt(user.getCreatedAt())
                .build();
    }
}
