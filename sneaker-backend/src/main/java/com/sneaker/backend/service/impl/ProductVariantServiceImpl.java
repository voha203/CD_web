package com.sneaker.backend.service.impl;

import com.sneaker.backend.dto.productVariant.ProductVariantResponse;
import com.sneaker.backend.entity.ProductVariant;
import com.sneaker.backend.repository.ProductVariantRepository;
import com.sneaker.backend.service.ProductImageService;
import com.sneaker.backend.service.ProductVariantService;
import com.sneaker.backend.service.ProductVariantSizeService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ProductVariantServiceImpl implements ProductVariantService {

    @Autowired
    private ProductVariantRepository repository;

    @Autowired
    private ProductImageService imageService;

    @Autowired
    private ProductVariantSizeService sizeService;

    private ProductVariantResponse toDTO(ProductVariant v) {
        ProductVariantResponse dto = new ProductVariantResponse();

        dto.setId(v.getId());
        dto.setColor(v.getColor());
        dto.setSku(v.getSku());

        dto.setImages(imageService.toDTOList(v.getImages()));
        dto.setSizes(sizeService.getByVariantId(v.getId()));

        return dto;
    }

    @Override
    public List<ProductVariantResponse> getByProductId(Long productId) {
        return repository.findByProductId(productId)
                .stream()
                .map(this::toDTO)
                .toList();
    }

    @Override
    public ProductVariantResponse getById(Long id) {
        return repository.findById(id)
                .map(this::toDTO)
                .orElseThrow();
    }

    @Override
    public ProductVariantResponse create(ProductVariantResponse dto) {

        ProductVariant v = new ProductVariant();
        v.setColor(dto.getColor());
        v.setSku(dto.getSku());

        return toDTO(repository.save(v));
    }
}