package com.sneaker.backend.service.impl;

import com.sneaker.backend.dto.address.ShippingAddressRequest;
import com.sneaker.backend.dto.address.ShippingAddressResponse;
import com.sneaker.backend.entity.ShippingAddress;
import com.sneaker.backend.entity.User;
import com.sneaker.backend.repository.ShippingAddressRepository;
import com.sneaker.backend.repository.UserRepository;
import com.sneaker.backend.service.ShippingAddressService;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@Service
public class ShippingAddressServiceImpl implements ShippingAddressService {

    @Autowired
    private ShippingAddressRepository addressRepository;

    @Autowired
    private UserRepository userRepository;

    @Override
    public List<ShippingAddressResponse> getMyAddresses() {
        Long userId = getCurrentUser().getId();
        return addressRepository.findByUserIdOrderByIsDefaultDescCreatedAtDesc(userId)
                .stream()
                .map(this::toResponse)
                .toList();
    }

    @Override
    public ShippingAddressResponse getMyAddress(Long id) {
        User user = getCurrentUser();
        return toResponse(getOwnedAddressEntity(id, user.getId()));
    }

    @Override
    @Transactional
    public ShippingAddressResponse create(ShippingAddressRequest request) {
        User user = getCurrentUser();
        boolean firstAddress = !addressRepository.existsByUserId(user.getId());
        boolean shouldBeDefault = firstAddress || Boolean.TRUE.equals(request.getIsDefault());

        if (shouldBeDefault) {
            unsetDefault(user.getId());
        }

        ShippingAddress address = new ShippingAddress();
        address.setUser(user);
        copyRequest(address, request);
        address.setIsDefault(shouldBeDefault);

        return toResponse(addressRepository.save(address));
    }

    @Override
    @Transactional
    public ShippingAddressResponse update(Long id, ShippingAddressRequest request) {
        User user = getCurrentUser();
        ShippingAddress address = getOwnedAddressEntity(id, user.getId());
        boolean shouldBeDefault = Boolean.TRUE.equals(request.getIsDefault());

        if (shouldBeDefault) {
            unsetDefault(user.getId());
        }

        copyRequest(address, request);
        address.setIsDefault(shouldBeDefault || Boolean.TRUE.equals(address.getIsDefault()));

        return toResponse(addressRepository.save(address));
    }

    @Override
    @Transactional
    public void delete(Long id) {
        User user = getCurrentUser();
        ShippingAddress address = getOwnedAddressEntity(id, user.getId());
        boolean wasDefault = Boolean.TRUE.equals(address.getIsDefault());

        addressRepository.delete(address);
        addressRepository.flush();

        if (wasDefault) {
            addressRepository.findFirstByUserIdOrderByCreatedAtDesc(user.getId())
                    .ifPresent(next -> {
                        next.setIsDefault(true);
                        addressRepository.save(next);
                    });
        }
    }

    @Override
    @Transactional
    public ShippingAddressResponse setDefault(Long id) {
        User user = getCurrentUser();
        ShippingAddress address = getOwnedAddressEntity(id, user.getId());
        unsetDefault(user.getId());
        address.setIsDefault(true);
        return toResponse(addressRepository.save(address));
    }

    @Override
    public ShippingAddress getOwnedAddressEntity(Long id, Long userId) {
        return addressRepository.findByIdAndUserId(id, userId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Không tìm thấy địa chỉ giao hàng"));
    }

    private void unsetDefault(Long userId) {
        addressRepository.findByUserIdOrderByIsDefaultDescCreatedAtDesc(userId)
                .forEach(address -> {
                    if (Boolean.TRUE.equals(address.getIsDefault())) {
                        address.setIsDefault(false);
                        addressRepository.save(address);
                    }
                });
    }

    private void copyRequest(ShippingAddress address, ShippingAddressRequest request) {
        address.setReceiverName(request.getReceiverName().trim());
        address.setReceiverPhone(request.getReceiverPhone().trim());
        address.setProvince(request.getProvince().trim());
        address.setDistrict(request.getDistrict().trim());
        address.setWard(request.getWard().trim());
        address.setDetailAddress(request.getDetailAddress().trim());
        address.setFullAddress(buildFullAddress(request));
    }

    private String buildFullAddress(ShippingAddressRequest request) {
        return String.join(", ",
                request.getDetailAddress().trim(),
                request.getWard().trim(),
                request.getDistrict().trim(),
                request.getProvince().trim());
    }

    private ShippingAddressResponse toResponse(ShippingAddress address) {
        ShippingAddressResponse response = new ShippingAddressResponse();
        response.setId(address.getId());
        response.setReceiverName(address.getReceiverName());
        response.setReceiverPhone(address.getReceiverPhone());
        response.setProvince(address.getProvince());
        response.setDistrict(address.getDistrict());
        response.setWard(address.getWard());
        response.setDetailAddress(address.getDetailAddress());
        response.setFullAddress(address.getFullAddress());
        response.setIsDefault(address.getIsDefault());
        response.setCreatedAt(address.getCreatedAt());
        response.setUpdatedAt(address.getUpdatedAt());
        return response;
    }

    private User getCurrentUser() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();

        if (auth == null || auth.getPrincipal() == null || !auth.isAuthenticated()) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Unauthenticated");
        }

        return userRepository.findByUsername(auth.getName())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.UNAUTHORIZED, "User not found"));
    }
}
