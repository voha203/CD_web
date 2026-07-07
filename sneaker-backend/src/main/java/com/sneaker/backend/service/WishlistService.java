package com.sneaker.backend.service;

import com.sneaker.backend.dto.wishlist.WishlistResponse;

import java.util.List;
import java.util.Map;

public interface WishlistService {
    List<WishlistResponse> getMyWishlist();

    WishlistResponse add(Long productId);

    Map<String, Object> remove(Long productId);

    Map<String, Boolean> check(Long productId);
}
