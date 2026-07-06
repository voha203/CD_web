package com.sneaker.backend.service.impl;

import com.sneaker.backend.dto.coupon.CouponCalculation;
import com.sneaker.backend.dto.coupon.CouponRequest;
import com.sneaker.backend.dto.coupon.CouponResponse;
import com.sneaker.backend.dto.coupon.CouponValidateResponse;
import com.sneaker.backend.entity.Cart;
import com.sneaker.backend.entity.CartItem;
import com.sneaker.backend.entity.Coupon;
import com.sneaker.backend.entity.User;
import com.sneaker.backend.repository.CartRepository;
import com.sneaker.backend.repository.CouponRepository;
import com.sneaker.backend.repository.UserRepository;
import com.sneaker.backend.service.CouponService;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class CouponServiceImpl implements CouponService {

    @Autowired
    private CouponRepository couponRepository;

    @Autowired
    private CartRepository cartRepository;

    @Autowired
    private UserRepository userRepository;

    @Override
    public CouponCalculation calculate(Cart cart, String couponCode) {
        double subtotalAmount = calculateSubtotal(cart);

        if (couponCode == null || couponCode.isBlank()) {
            return new CouponCalculation(subtotalAmount, null, 0, subtotalAmount, "Không sử dụng mã giảm giá");
        }

        Coupon coupon = getValidCoupon(couponCode.trim(), subtotalAmount);
        double discountAmount = calculateDiscount(coupon, subtotalAmount);
        double finalAmount = Math.max(0, subtotalAmount - discountAmount);

        return new CouponCalculation(
                subtotalAmount,
                coupon.getCode(),
                discountAmount,
                finalAmount,
                "Áp dụng mã giảm giá thành công"
        );
    }

    @Override
    @Transactional
    public CouponValidateResponse validateCurrentUserCart(String couponCode) {
        Long currentUserId = getCurrentUserId();
        Cart cart = cartRepository.findByUserId(currentUserId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.BAD_REQUEST, "Giỏ hàng không tồn tại"));

        if (cart.getItems().isEmpty()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Giỏ hàng đang trống");
        }

        CouponCalculation calculation = calculate(cart, couponCode);

        return new CouponValidateResponse(
                calculation.getSubtotalAmount(),
                calculation.getCouponCode(),
                calculation.getDiscountAmount(),
                calculation.getFinalAmount(),
                calculation.getMessage()
        );
    }

    @Override
    @Transactional
    public void markCouponUsed(String couponCode) {
        if (couponCode == null || couponCode.isBlank()) return;

        Coupon coupon = couponRepository.findByCodeIgnoreCase(couponCode.trim())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.BAD_REQUEST, "Mã giảm giá không tồn tại"));

        coupon.setUsedCount(coupon.getUsedCount() + 1);
        couponRepository.save(coupon);
    }

    @Override
    @Transactional
    public void releaseCouponUsage(String couponCode) {
        if (couponCode == null || couponCode.isBlank()) return;

        couponRepository.findByCodeIgnoreCase(couponCode.trim()).ifPresent(coupon -> {
            coupon.setUsedCount(Math.max(0, coupon.getUsedCount() - 1));
            couponRepository.save(coupon);
        });
    }

    @Override
    public List<CouponResponse> getAll() {
        return couponRepository.findAll().stream()
                .map(this::toResponse)
                .toList();
    }

    @Override
    public CouponResponse getById(Long id) {
        return toResponse(findCoupon(id));
    }

    @Override
    @Transactional
    public CouponResponse create(CouponRequest request) {
        String code = normalizeCode(request.getCode());

        if (couponRepository.existsByCodeIgnoreCase(code)) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Mã giảm giá đã tồn tại");
        }

        Coupon coupon = new Coupon();
        applyRequest(coupon, request);
        coupon.setCode(code);

        return toResponse(couponRepository.save(coupon));
    }

    @Override
    @Transactional
    public CouponResponse update(Long id, CouponRequest request) {
        Coupon coupon = findCoupon(id);
        String code = normalizeCode(request.getCode());

        couponRepository.findByCodeIgnoreCase(code).ifPresent(existing -> {
            if (!existing.getId().equals(id)) {
                throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Mã giảm giá đã tồn tại");
            }
        });

        applyRequest(coupon, request);
        coupon.setCode(code);

        return toResponse(couponRepository.save(coupon));
    }

    @Override
    @Transactional
    public CouponResponse toggle(Long id) {
        Coupon coupon = findCoupon(id);
        coupon.setActive(!coupon.isActive());
        return toResponse(couponRepository.save(coupon));
    }

    @Override
    @Transactional
    public void delete(Long id) {
        Coupon coupon = findCoupon(id);
        couponRepository.delete(coupon);
    }

    private Coupon getValidCoupon(String couponCode, double subtotalAmount) {
        Coupon coupon = couponRepository.findByCodeIgnoreCase(couponCode)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.BAD_REQUEST, "Mã giảm giá không tồn tại"));

        LocalDateTime now = LocalDateTime.now();

        if (!coupon.isActive()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Mã giảm giá không còn hoạt động");
        }

        if (coupon.getStartDate() != null && now.isBefore(coupon.getStartDate())) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Mã giảm giá chưa bắt đầu");
        }

        if (coupon.getEndDate() != null && now.isAfter(coupon.getEndDate())) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Mã giảm giá đã hết hạn");
        }

        if (coupon.getUsageLimit() != null && coupon.getUsedCount() >= coupon.getUsageLimit()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Mã giảm giá đã hết lượt sử dụng");
        }

        if (subtotalAmount < coupon.getMinOrderAmount()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Đơn hàng chưa đạt giá trị tối thiểu để dùng mã");
        }

        return coupon;
    }

    private double calculateDiscount(Coupon coupon, double subtotalAmount) {
        double discountAmount;

        if ("PERCENT".equalsIgnoreCase(coupon.getDiscountType())) {
            discountAmount = subtotalAmount * coupon.getDiscountValue() / 100.0;
        } else if ("FIXED".equalsIgnoreCase(coupon.getDiscountType())) {
            discountAmount = coupon.getDiscountValue();
        } else {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Loại mã giảm giá không hợp lệ");
        }

        if (coupon.getMaxDiscountAmount() != null) {
            discountAmount = Math.min(discountAmount, coupon.getMaxDiscountAmount());
        }

        return Math.min(discountAmount, subtotalAmount);
    }

    private double calculateSubtotal(Cart cart) {
        return cart.getItems().stream()
                .mapToDouble(this::calculateItemTotal)
                .sum();
    }

    private double calculateItemTotal(CartItem item) {
        return item.getVariantSize().getVariant().getProduct().getPrice() * item.getQuantity();
    }

    private Coupon findCoupon(Long id) {
        return couponRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Không tìm thấy mã giảm giá"));
    }

    private void applyRequest(Coupon coupon, CouponRequest request) {
        validateBusinessRules(request);

        coupon.setName(request.getName().trim());
        coupon.setDescription(request.getDescription());
        coupon.setDiscountType(request.getDiscountType().trim().toUpperCase());
        coupon.setDiscountValue(request.getDiscountValue());
        coupon.setMinOrderAmount(request.getMinOrderAmount() != null ? request.getMinOrderAmount() : 0);
        coupon.setMaxDiscountAmount(request.getMaxDiscountAmount());
        coupon.setStartDate(request.getStartDate());
        coupon.setEndDate(request.getEndDate());
        coupon.setUsageLimit(request.getUsageLimit());
        coupon.setActive(request.getActive() == null || request.getActive());
    }

    private void validateBusinessRules(CouponRequest request) {
        validateDateRange(request.getStartDate(), request.getEndDate());

        if ("PERCENT".equalsIgnoreCase(request.getDiscountType()) && request.getDiscountValue() > 100) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Phần trăm giảm giá không được lớn hơn 100");
        }

        if (request.getMaxDiscountAmount() != null && request.getMaxDiscountAmount() <= 0) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Mức giảm tối đa phải lớn hơn 0");
        }
    }

    private void validateDateRange(LocalDateTime startDate, LocalDateTime endDate) {
        if (startDate != null && endDate != null && endDate.isBefore(startDate)) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Ngày kết thúc phải sau ngày bắt đầu");
        }
    }

    private CouponResponse toResponse(Coupon coupon) {
        CouponResponse response = new CouponResponse();
        response.setId(coupon.getId());
        response.setCode(coupon.getCode());
        response.setName(coupon.getName());
        response.setDescription(coupon.getDescription());
        response.setDiscountType(coupon.getDiscountType());
        response.setDiscountValue(coupon.getDiscountValue());
        response.setMinOrderAmount(coupon.getMinOrderAmount());
        response.setMaxDiscountAmount(coupon.getMaxDiscountAmount());
        response.setStartDate(coupon.getStartDate());
        response.setEndDate(coupon.getEndDate());
        response.setUsageLimit(coupon.getUsageLimit());
        response.setUsedCount(coupon.getUsedCount());
        response.setActive(coupon.isActive());
        response.setCreatedAt(coupon.getCreatedAt());
        return response;
    }

    private String normalizeCode(String code) {
        return code.trim().toUpperCase();
    }

    private Long getCurrentUserId() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();

        if (auth == null || auth.getPrincipal() == null || !auth.isAuthenticated()) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Unauthenticated");
        }

        User user = userRepository.findByUsername(auth.getName())
                .orElseThrow(() -> new RuntimeException("User not found"));

        return user.getId();
    }
}
