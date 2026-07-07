package com.sneaker.backend.service;

import com.sneaker.backend.dto.address.ShippingAddressRequest;
import com.sneaker.backend.dto.address.ShippingAddressResponse;
import com.sneaker.backend.entity.ShippingAddress;

import java.util.List;

public interface ShippingAddressService {
    List<ShippingAddressResponse> getMyAddresses();

    ShippingAddressResponse getMyAddress(Long id);

    ShippingAddressResponse create(ShippingAddressRequest request);

    ShippingAddressResponse update(Long id, ShippingAddressRequest request);

    void delete(Long id);

    ShippingAddressResponse setDefault(Long id);

    ShippingAddress getOwnedAddressEntity(Long id, Long userId);
}
