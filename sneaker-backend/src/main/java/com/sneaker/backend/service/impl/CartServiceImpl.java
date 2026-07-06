package com.sneaker.backend.service.impl;

import com.sneaker.backend.dto.cart.*;
import com.sneaker.backend.dto.cartItem.CartItemResponse;
import com.sneaker.backend.entity.*;
import com.sneaker.backend.mapper.CartMapper;
import com.sneaker.backend.repository.*;
import com.sneaker.backend.service.CartService;
import com.sneaker.backend.service.DiscountService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

@Service
public class CartServiceImpl implements CartService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private CartRepository cartRepository;

    @Autowired
    private CartItemRepository cartItemRepository;

    @Autowired
    private ProductVariantSizeRepository variantSizeRepository;

    @Autowired
    private CartMapper cartMapper;

    @Autowired
    private DiscountService discountService;

    // =========================
    // GET CART
    // =========================
    @Override
    public CartResponse getMyCart() {
        Long userId = getCurrentUserId();
        Cart cart = getOrCreateCart(userId);

        CartResponse dto = cartMapper.toDTO(cart);

        // TÍNH TOTAL PRICE
        for (CartItemResponse itemResponse : dto.getItems()) {
            cart.getItems().stream()
                    .filter(item -> item.getId().equals(itemResponse.getId()))
                    .findFirst()
                    .ifPresent(cartItem -> {
                        Product product = cartItem.getVariantSize().getVariant().getProduct();
                        long originalPrice = Math.round(product.getPrice());
                        long finalPrice = Math.round(discountService.getFinalPrice(product));

                        itemResponse.setOriginalPrice(originalPrice);
                        itemResponse.setPrice(finalPrice);
                        itemResponse.setOnSale(finalPrice < originalPrice);
                        itemResponse.setDiscountPercent(discountService.getDiscountPercent(product));
                    });
        }

        Long total = dto.getItems().stream()
                .mapToLong(item -> item.getPrice() * item.getQuantity())
                .sum();

        dto.setTotalPrice(total);

        return dto;
    }

    // =========================
    // ADD TO CART
    // =========================
    @Override
    public void addToCart(CartRequest request) {
        Long userId = getCurrentUserId();

        validateAddRequest(request);

        Cart cart = getOrCreateCart(userId);

        CartItem item = findExistingItem(
                cart.getId(),
                request.getVariantSizeId()
        );

        if (item != null) {
            item.setQuantity(item.getQuantity() + request.getQuantity());
        } else {
            item = createCartItem(cart, request);
        }

        cartItemRepository.save(item);
    }

    // =========================
    // UPDATE QUANTITY
    // =========================
    @Override
    public void updateQuantity(Long itemId, int quantity) {

        CartItem item = findItemById(itemId);

        Long userId = getCurrentUserId();

        if (!item.getCart().getUserId().equals(userId)) {
            throw new RuntimeException("Forbidden");
        }

        if (quantity <= 0) {
            cartItemRepository.delete(item);
        } else {
            item.setQuantity(quantity);
            cartItemRepository.save(item);
        }
    }

    // =========================
    // REMOVE ITEM
    // =========================
    @Override
    public void removeCartItem(Long itemId) {
        CartItem item = findItemById(itemId);

        Long userId = getCurrentUserId();

        if (!item.getCart().getUserId().equals(userId)) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Forbidden");
        }

        cartItemRepository.delete(item);
    }

    // =========================
    // CLEAR CART
    // =========================
    @Override
    public void clearCart() {
        Long userId = getCurrentUserId();
        Cart cart = getOrCreateCart(userId);
        cart.getItems().clear();
        cartRepository.save(cart);
    }

    // =========================
    // CÁC PHƯƠNG THỨC HỖ TRỢ NHỎ
    // =========================
    private Cart getOrCreateCart(Long userId) {
        return cartRepository.findByUserId(userId)
                .orElseGet(() -> {
                    Cart c = new Cart();
                    c.setUserId(userId);
                    return cartRepository.save(c);
                });
    }

    private CartItem findExistingItem(Long cartId, Long variantSizeId) {
        return cartItemRepository
                .findByCartIdAndVariantSizeId(cartId, variantSizeId)
                .orElse(null);
    }

    private CartItem findItemById(Long id) {
        return cartItemRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("CartItem not found: " + id));
    }

    private ProductVariantSize findVariantSize(Long id) {
        return variantSizeRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("VariantSize not found: " + id));
    }

    private CartItem createCartItem(Cart cart, CartRequest req) {

        CartItem item = new CartItem();

        item.setCart(cart);
        item.setVariantSize(findVariantSize(req.getVariantSizeId()));
        item.setQuantity(req.getQuantity());

        return item;
    }

    private void validateAddRequest(CartRequest req) {

        if (req.getVariantSizeId() == null) {
            throw new RuntimeException("variantSizeId is required");
        }

        if (req.getQuantity() == null || req.getQuantity() <= 0) {
            throw new RuntimeException("quantity must be > 0");
        }
    }

    private String getCurrentUsername() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();

        if (auth == null || auth.getPrincipal() == null || !auth.isAuthenticated()) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Unauthenticated");
        }

        return auth.getName();
    }

    private Long getCurrentUserId() {
        String username = getCurrentUsername();

        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));

        return user.getId();
    }
}
