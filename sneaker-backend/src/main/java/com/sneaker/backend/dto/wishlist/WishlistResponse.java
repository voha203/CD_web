package com.sneaker.backend.dto.wishlist;

import com.sneaker.backend.dto.product.ProductResponse;
import lombok.Data;

import java.time.LocalDateTime;

@Data
public class WishlistResponse {
    private Long id;
    private Long productId;
    private LocalDateTime createdAt;
    private ProductResponse product;
}
