package com.sneaker.backend.service.impl;

import com.sneaker.backend.dto.productImage.ProductImageResponse;
import com.sneaker.backend.entity.ProductImage;
import com.sneaker.backend.repository.ProductImageRepository;
import com.sneaker.backend.service.ProductImageService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ProductImageServiceImpl implements ProductImageService {

    @Autowired
    private ProductImageRepository repository;

    private ProductImageResponse toDTO(ProductImage img) {
        ProductImageResponse dto = new ProductImageResponse();

        dto.setId(img.getId());
        dto.setImageUrl(img.getImageUrl());
        dto.setMain(img.isMain());

        return dto;
    }

    @Override
    public List<ProductImageResponse> toDTOList(List<ProductImage> images) {
        return images.stream().map(this::toDTO).toList();
    }

    @Override
    public List<ProductImageResponse> getByVariantId(Long variantId) {
        return repository.findByVariantId(variantId)
                .stream()
                .map(this::toDTO)
                .toList();
    }
}