package com.sneaker.backend.controller;

import com.sneaker.backend.dto.address.ShippingAddressRequest;
import com.sneaker.backend.dto.address.ShippingAddressResponse;
import com.sneaker.backend.service.ShippingAddressService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/addresses")
public class ShippingAddressController {

    @Autowired
    private ShippingAddressService addressService;

    @GetMapping
    public List<ShippingAddressResponse> getMyAddresses() {
        return addressService.getMyAddresses();
    }

    @GetMapping("/{id}")
    public ShippingAddressResponse getMyAddress(@PathVariable Long id) {
        return addressService.getMyAddress(id);
    }

    @PostMapping
    public ShippingAddressResponse create(@Valid @RequestBody ShippingAddressRequest request) {
        return addressService.create(request);
    }

    @PutMapping("/{id}")
    public ShippingAddressResponse update(@PathVariable Long id,
                                          @Valid @RequestBody ShippingAddressRequest request) {
        return addressService.update(id, request);
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id) {
        addressService.delete(id);
    }

    @PatchMapping("/{id}/default")
    public ShippingAddressResponse setDefault(@PathVariable Long id) {
        return addressService.setDefault(id);
    }
}
