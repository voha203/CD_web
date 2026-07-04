package com.sneaker.backend.dto.orderItem;

import com.sneaker.backend.dto.productImage.ProductImageResponse;
import lombok.Data;

import java.util.List;

@Data
public class OrderItemResponse {
    private Long productId;
    private String productName;
    private String color;
    private String sizeValue;

    private List<ProductImageResponse> images;

    private int quantity;
    private double price; // Giá tại thời điểm mua
    private double subTotal;
}