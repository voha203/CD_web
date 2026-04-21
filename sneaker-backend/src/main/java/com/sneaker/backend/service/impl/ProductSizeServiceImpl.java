package com.sneaker.backend.service.impl;

import com.sneaker.backend.dto.productsize.ProductSizeDTO;
import com.sneaker.backend.entity.ProductSize;
import com.sneaker.backend.repository.ProductRepository;
import com.sneaker.backend.repository.ProductSizeRepository;
import com.sneaker.backend.service.ProductSizeService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ProductSizeServiceImpl implements ProductSizeService {

    @Autowired
    private ProductSizeRepository productSizeRepository;

    @Autowired
    private ProductRepository productRepository;

    @Override
    public List<ProductSizeDTO> getByProduct(Long productId) {
        List<ProductSize> list = productSizeRepository.findByProductId(productId);

        return list.stream().map(ps -> {
            ProductSizeDTO dto = new ProductSizeDTO();
            dto.setId(ps.getId());
            dto.setSize(ps.getSize());
            dto.setQuantity(ps.getQuantity());

            // Kiểm tra null an toàn trước khi lấy ID
            if (ps.getProduct() != null) {
                dto.setProductId(ps.getProduct().getId());
            }

            return dto;
        }).toList();
    }
    @Override
    public ProductSize create(ProductSize productSize) {

        // 🔥 CHECK NULL PRODUCT
        if (productSize.getProduct() == null || productSize.getProduct().getId() == null) {
            throw new RuntimeException("ProductId is required");
        }

        Long productId = productSize.getProduct().getId();
        Integer size = productSize.getSize();

        //  CHECK SIZE
        if (size == null || size < 30 || size > 50) {
            throw new RuntimeException("Invalid size (30-50)");
        }

        //  CHECK QUANTITY
        if (productSize.getQuantity() == null || productSize.getQuantity() < 0) {
            throw new RuntimeException("Quantity must be >= 0");
        }

        //  CHECK PRODUCT TỒN TẠI
        var product = productRepository.findById(productId)
                .orElseThrow(() -> new RuntimeException("Product not found"));

        //  CHECK TRÙNG
        boolean exists = productSizeRepository
                .existsByProductIdAndSize(productId, size);

        if (exists) {
            throw new RuntimeException("Size already exists for this product");
        }

        productSize.setProduct(product);

        return productSizeRepository.save(productSize);
    }
}