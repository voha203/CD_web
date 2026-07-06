package com.sneaker.backend.dto.admin;

import com.sneaker.backend.dto.productImage.ProductImageResponse;
import lombok.Builder;
import lombok.Data;

import java.util.List;

@Data
@Builder
public class AdminOrderItemResponse {
    private Long productId;
    private String productName;
    private String color;
    private String sizeValue;
    private List<ProductImageResponse> images;
    private int quantity;
    private double originalPrice;
    private double price;
    private double subTotal;
}
