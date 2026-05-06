package com.sneaker.backend.dto.cartItem;

import com.sneaker.backend.dto.productImage.ProductImageDTO;
import lombok.Data;

import java.util.List;

@Data
public class CartItemDTO {
    private Long id;

    private Long variantSizeId;

    private String productName;
    private String color;
    private String sizeValue;

    private List<ProductImageDTO> images;

    private String brand;
    private Long price;

    private int quantity;
}