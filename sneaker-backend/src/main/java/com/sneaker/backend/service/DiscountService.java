package com.sneaker.backend.service;

import com.sneaker.backend.entity.Discount;
import com.sneaker.backend.entity.Product;

import java.util.List;

public interface DiscountService {

    List<Discount> getAll();

    Discount create(Discount discount);

    List<Discount> getByProduct(Long productId);
    Double getFinalPrice(Product product);

    void delete(Long id);
}