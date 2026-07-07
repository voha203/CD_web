package com.sneaker.backend.controller;

import com.sneaker.backend.dto.wishlist.WishlistResponse;
import com.sneaker.backend.service.WishlistService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/wishlist")
@CrossOrigin("*")
public class WishlistController {

    @Autowired
    private WishlistService wishlistService;

    @GetMapping
    public List<WishlistResponse> getMyWishlist() {
        return wishlistService.getMyWishlist();
    }

    @PostMapping("/{productId}")
    public WishlistResponse add(@PathVariable Long productId) {
        return wishlistService.add(productId);
    }

    @DeleteMapping("/{productId}")
    public Map<String, Object> remove(@PathVariable Long productId) {
        return wishlistService.remove(productId);
    }

    @GetMapping("/check/{productId}")
    public Map<String, Boolean> check(@PathVariable Long productId) {
        return wishlistService.check(productId);
    }
}
