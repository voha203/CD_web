package com.sneaker.backend.dto.cartItem;

import com.sneaker.backend.dto.productImage.ProductImageResponse;
import lombok.Data;

import java.util.List;

@Data
public class CartItemResponse {
    private Long id;

    private Long variantSizeId;

    private String productName;
    private String color;
    private String sizeValue;

    private List<ProductImageResponse> images;

    private String brand;
    private Long price;
    private Long originalPrice;
    private Boolean onSale;
    private Integer discountPercent;

    private int quantity;
}
