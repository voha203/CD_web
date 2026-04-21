package com.sneaker.backend.service.impl;

import com.sneaker.backend.entity.Discount;
import com.sneaker.backend.entity.Product;
import com.sneaker.backend.repository.DiscountRepository;
import com.sneaker.backend.repository.ProductRepository;
import com.sneaker.backend.service.DiscountService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class DiscountServiceImpl implements DiscountService {

    @Autowired
    private DiscountRepository discountRepository;

    @Autowired
    private ProductRepository productRepository;

    // =========================
    // GET ALL
    // =========================
    @Override
    public List<Discount> getAll() {
        return discountRepository.findAll();
    }

    // =========================
    // CREATE
    // =========================
    @Override
    public Discount create(Discount discount) {

        Product product = productRepository.findById(discount.getProduct().getId())
                .orElseThrow(() -> new RuntimeException("Product not found"));

        discount.setProduct(product);

        return discountRepository.save(discount);
    }

    // =========================
    // GET BY PRODUCT
    // =========================
    @Override
    public List<Discount> getByProduct(Long productId) {
        return discountRepository.findByProductId(productId);
    }

    // =========================
    //  TÍNH GIÁ TỐT NHẤT
    // =========================
    @Override
    public Double getFinalPrice(Product product) {

        List<Discount> discounts = discountRepository.findByProductId(product.getId());

        //  không có discount
        if (discounts.isEmpty()) {
            return product.getPrice();
        }

        LocalDateTime now = LocalDateTime.now();

        // lọc discount hợp lệ
        List<Discount> validDiscounts = discounts.stream()
                .filter(d -> Boolean.TRUE.equals(d.getActive()))
                .filter(d -> d.getStartDate() == null || !now.isBefore(d.getStartDate()))
                .filter(d -> d.getEndDate() == null || !now.isAfter(d.getEndDate()))
                .toList();

        if (validDiscounts.isEmpty()) {
            return product.getPrice();
        }

        Double price = product.getPrice();

        //  chọn discount tốt nhất
        Discount best = validDiscounts.stream()
                .max((d1, d2) -> {
                    double v1 = calculateDiscountAmount(price, d1);
                    double v2 = calculateDiscountAmount(price, d2);
                    return Double.compare(v1, v2);
                })
                .orElse(null);

        if (best == null) return price;

        Double result;

        if ("PERCENT".equalsIgnoreCase(best.getType())) {
            result = price - (price * best.getValue() / 100);
        } else {
            result = price - best.getValue();
        }

        // tránh âm giá
        return Math.max(result, 0);
    }

    // =========================
    // hàm phụ tính giá tr giảm theo % hay là cố định
    // =========================
    private double calculateDiscountAmount(Double price, Discount d) {

        if ("PERCENT".equalsIgnoreCase(d.getType())) {
            return price * d.getValue() / 100;
        } else {
            return d.getValue();
        }
    }
    @Override
    public void delete(Long id) {

        Discount d = discountRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Discount not found"));

        discountRepository.delete(d);
    }
}