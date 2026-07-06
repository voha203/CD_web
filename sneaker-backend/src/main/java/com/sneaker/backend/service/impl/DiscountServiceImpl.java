package com.sneaker.backend.service.impl;

import com.sneaker.backend.dto.discount.DiscountRequest;
import com.sneaker.backend.dto.discount.DiscountResponse;
import com.sneaker.backend.entity.Discount;
import com.sneaker.backend.entity.Product;
import com.sneaker.backend.repository.DiscountRepository;
import com.sneaker.backend.repository.ProductRepository;
import com.sneaker.backend.service.DiscountService;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.time.LocalDateTime;
import java.util.Comparator;
import java.util.List;
import java.util.Optional;

@Service
public class DiscountServiceImpl implements DiscountService {

    @Autowired
    private DiscountRepository discountRepository;

    @Autowired
    private ProductRepository productRepository;

    @Override
    public List<DiscountResponse> getAll() {
        return discountRepository.findAll().stream()
                .sorted(Comparator.comparing(Discount::getId).reversed())
                .map(this::toResponse)
                .toList();
    }

    @Override
    public List<DiscountResponse> getActive() {
        LocalDateTime now = LocalDateTime.now();

        return discountRepository.findAll().stream()
                .filter(discount -> isActiveNow(discount, now))
                .map(this::toResponse)
                .toList();
    }

    @Override
    public List<DiscountResponse> getByProduct(Long productId) {
        return discountRepository.findByProductId(productId).stream()
                .map(this::toResponse)
                .toList();
    }

    @Override
    public DiscountResponse getById(Long id) {
        return toResponse(findDiscount(id));
    }

    @Override
    @Transactional
    public DiscountResponse create(DiscountRequest request) {
        Discount discount = new Discount();
        applyRequest(discount, request);
        return toResponse(discountRepository.save(discount));
    }

    @Override
    @Transactional
    public DiscountResponse update(Long id, DiscountRequest request) {
        Discount discount = findDiscount(id);
        applyRequest(discount, request);
        return toResponse(discountRepository.save(discount));
    }

    @Override
    @Transactional
    public DiscountResponse toggle(Long id) {
        Discount discount = findDiscount(id);
        discount.setActive(!Boolean.TRUE.equals(discount.getActive()));
        return toResponse(discountRepository.save(discount));
    }

    @Override
    public Double getFinalPrice(Product product) {
        if (product == null || product.getPrice() == null) {
            return 0D;
        }

        return getBestActiveDiscount(product)
                .map(discount -> calculateFinalPrice(product.getPrice(), discount))
                .orElse(product.getPrice());
    }

    @Override
    public Optional<Discount> getBestActiveDiscount(Product product) {
        if (product == null || product.getId() == null || product.getPrice() == null) {
            return Optional.empty();
        }

        LocalDateTime now = LocalDateTime.now();
        Double price = product.getPrice();

        return discountRepository.findByProductId(product.getId()).stream()
                .filter(discount -> isActiveNow(discount, now))
                .max(Comparator.comparingDouble(discount -> calculateDiscountAmount(price, discount)));
    }

    @Override
    public Integer getDiscountPercent(Product product) {
        if (product == null || product.getPrice() == null || product.getPrice() <= 0) {
            return 0;
        }

        double finalPrice = getFinalPrice(product);
        double discountAmount = Math.max(0, product.getPrice() - finalPrice);

        return (int) Math.round(discountAmount * 100 / product.getPrice());
    }

    @Override
    @Transactional
    public void delete(Long id) {
        discountRepository.delete(findDiscount(id));
    }

    private void applyRequest(Discount discount, DiscountRequest request) {
        validateBusinessRules(request);

        Product product = productRepository.findById(request.getProductId())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Không tìm thấy sản phẩm"));

        discount.setName(request.getName().trim());
        discount.setType(request.getType().trim().toUpperCase());
        discount.setValue(request.getValue());
        discount.setStartDate(request.getStartDate());
        discount.setEndDate(request.getEndDate());
        discount.setActive(request.getActive() == null || request.getActive());
        discount.setProduct(product);
    }

    private void validateBusinessRules(DiscountRequest request) {
        if (request.getStartDate() != null && request.getEndDate() != null
                && request.getEndDate().isBefore(request.getStartDate())) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Ngày kết thúc phải sau ngày bắt đầu");
        }

        if ("PERCENT".equalsIgnoreCase(request.getType()) && request.getValue() > 100) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Phần trăm giảm giá không được lớn hơn 100");
        }
    }

    private boolean isActiveNow(Discount discount, LocalDateTime now) {
        return Boolean.TRUE.equals(discount.getActive())
                && (discount.getStartDate() == null || !now.isBefore(discount.getStartDate()))
                && (discount.getEndDate() == null || !now.isAfter(discount.getEndDate()));
    }

    private double calculateDiscountAmount(Double price, Discount discount) {
        if ("PERCENT".equalsIgnoreCase(discount.getType())) {
            return price * discount.getValue() / 100;
        }

        if ("FIXED".equalsIgnoreCase(discount.getType())) {
            return discount.getValue();
        }

        return 0;
    }

    private double calculateFinalPrice(Double price, Discount discount) {
        double discountAmount = calculateDiscountAmount(price, discount);
        return Math.max(0, price - Math.min(discountAmount, price));
    }

    private int calculateDiscountPercent(Double price, Discount discount) {
        if (price == null || price <= 0) {
            return 0;
        }

        double discountAmount = Math.max(0, price - calculateFinalPrice(price, discount));
        return (int) Math.round(discountAmount * 100 / price);
    }

    private Discount findDiscount(Long id) {
        return discountRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Không tìm thấy khuyến mãi"));
    }

    private DiscountResponse toResponse(Discount discount) {
        DiscountResponse response = new DiscountResponse();
        Product product = discount.getProduct();

        response.setId(discount.getId());
        response.setName(discount.getName());
        response.setType(discount.getType());
        response.setValue(discount.getValue());
        response.setStartDate(discount.getStartDate());
        response.setEndDate(discount.getEndDate());
        response.setActive(discount.getActive());

        if (product != null) {
            response.setProductId(product.getId());
            response.setProductName(product.getName());
            response.setOriginalPrice(product.getPrice());
            response.setFinalPrice(calculateFinalPrice(product.getPrice(), discount));
            response.setDiscountPercent(calculateDiscountPercent(product.getPrice(), discount));
        }

        return response;
    }
}
