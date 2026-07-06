package com.sneaker.backend.service;

import com.sneaker.backend.dto.discount.DiscountRequest;
import com.sneaker.backend.dto.discount.DiscountResponse;
import com.sneaker.backend.entity.Product;

import java.util.List;
import java.util.Optional;

public interface DiscountService {

    List<DiscountResponse> getAll();

    List<DiscountResponse> getActive();

    List<DiscountResponse> getByProduct(Long productId);

    DiscountResponse getById(Long id);

    DiscountResponse create(DiscountRequest request);

    DiscountResponse update(Long id, DiscountRequest request);

    DiscountResponse toggle(Long id);

    Double getFinalPrice(Product product);

    Optional<com.sneaker.backend.entity.Discount> getBestActiveDiscount(Product product);

    Integer getDiscountPercent(Product product);

    void delete(Long id);
}
