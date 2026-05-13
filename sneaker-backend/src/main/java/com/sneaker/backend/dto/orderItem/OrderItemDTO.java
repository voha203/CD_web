package com.sneaker.backend.dto.orderItem;

import com.sneaker.backend.dto.productImage.ProductImageDTO;
import lombok.Data;

import java.util.List;

@Data
public class OrderItemDTO {
    private Long productId;
    private String productName;
    private String color;
    private String sizeValue;

    private List<ProductImageDTO> images;

    private int quantity;
    private double price; // Giá tại thời điểm mua
    private double subTotal;
}