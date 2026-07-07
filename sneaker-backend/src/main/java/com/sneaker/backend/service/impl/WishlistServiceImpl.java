package com.sneaker.backend.service.impl;

import com.sneaker.backend.dto.product.ProductResponse;
import com.sneaker.backend.dto.wishlist.WishlistResponse;
import com.sneaker.backend.entity.Product;
import com.sneaker.backend.entity.User;
import com.sneaker.backend.entity.Wishlist;
import com.sneaker.backend.mapper.ProductMapper;
import com.sneaker.backend.repository.ProductRepository;
import com.sneaker.backend.repository.UserRepository;
import com.sneaker.backend.repository.WishlistRepository;
import com.sneaker.backend.service.DiscountService;
import com.sneaker.backend.service.WishlistService;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;
import java.util.Map;

@Service
public class WishlistServiceImpl implements WishlistService {

    @Autowired
    private WishlistRepository wishlistRepository;

    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private ProductMapper productMapper;

    @Autowired
    private DiscountService discountService;

    @Override
    public List<WishlistResponse> getMyWishlist() {
        Long userId = getCurrentUser().getId();
        return wishlistRepository.findByUserIdOrderByCreatedAtDesc(userId)
                .stream()
                .map(this::toResponse)
                .toList();
    }

    @Override
    @Transactional
    public WishlistResponse add(Long productId) {
        User user = getCurrentUser();
        Product product = findActiveProduct(productId);

        return wishlistRepository.findByUserIdAndProductId(user.getId(), productId)
                .map(this::toResponse)
                .orElseGet(() -> {
                    Wishlist wishlist = new Wishlist();
                    wishlist.setUser(user);
                    wishlist.setProduct(product);
                    return toResponse(wishlistRepository.save(wishlist));
                });
    }

    @Override
    @Transactional
    public Map<String, Object> remove(Long productId) {
        User user = getCurrentUser();
        findActiveProduct(productId);

        boolean existed = wishlistRepository.existsByUserIdAndProductId(user.getId(), productId);
        if (existed) {
            wishlistRepository.deleteByUserIdAndProductId(user.getId(), productId);
        }

        return Map.of(
                "favorited", false,
                "removed", existed,
                "message", existed ? "Đã xóa sản phẩm khỏi danh sách yêu thích" : "Sản phẩm chưa có trong danh sách yêu thích"
        );
    }

    @Override
    public Map<String, Boolean> check(Long productId) {
        User user = getCurrentUser();
        findActiveProduct(productId);
        return Map.of("favorited", wishlistRepository.existsByUserIdAndProductId(user.getId(), productId));
    }

    private Product findActiveProduct(Long productId) {
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Không tìm thấy sản phẩm"));

        if (Boolean.FALSE.equals(product.getActive())) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Không tìm thấy sản phẩm");
        }

        return product;
    }

    private WishlistResponse toResponse(Wishlist wishlist) {
        WishlistResponse response = new WishlistResponse();
        response.setId(wishlist.getId());
        response.setProductId(wishlist.getProduct().getId());
        response.setCreatedAt(wishlist.getCreatedAt());
        response.setProduct(toProductResponse(wishlist.getProduct()));
        return response;
    }

    private ProductResponse toProductResponse(Product product) {
        ProductResponse response = productMapper.toDTO(product);
        double finalPrice = discountService.getFinalPrice(product);
        response.setFinalPrice(finalPrice);
        response.setOnSale(product.getPrice() != null && finalPrice < product.getPrice());
        if (Boolean.TRUE.equals(response.getOnSale()) && product.getPrice() != null && product.getPrice() > 0) {
            response.setDiscountPercent((int) Math.round((product.getPrice() - finalPrice) * 100 / product.getPrice()));
        } else {
            response.setDiscountPercent(0);
        }
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
