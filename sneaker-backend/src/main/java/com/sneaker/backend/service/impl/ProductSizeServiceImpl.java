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

        Long productId = productSize.getProduct().getId();
        Integer size = productSize.getSize();

        // CHECK TRÙNG
        boolean exists = productSizeRepository
                .existsByProductIdAndSize(productId, size);

        if (exists) {
            throw new RuntimeException("Size already exists for this product");
        }

        return productSizeRepository.save(productSize);
    }
}