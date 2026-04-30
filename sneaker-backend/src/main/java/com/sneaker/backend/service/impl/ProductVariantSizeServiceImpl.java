package com.sneaker.backend.service.impl;

import com.sneaker.backend.dto.productVariantSize.ProductVariantSizeDTO;
import com.sneaker.backend.entity.ProductVariantSize;
import com.sneaker.backend.repository.ProductVariantSizeRepository;
import com.sneaker.backend.service.ProductVariantSizeService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ProductVariantSizeServiceImpl implements ProductVariantSizeService {

    @Autowired
    private ProductVariantSizeRepository repository;

    private ProductVariantSizeDTO toDTO(ProductVariantSize s) {

        ProductVariantSizeDTO dto = new ProductVariantSizeDTO();

        dto.setId(s.getId());
        dto.setVariantId(s.getVariant().getId());
        dto.setSizeId(s.getSize().getId());
        dto.setSizeValue(s.getSize().getValue());
        dto.setQuantity(s.getQuantity());

        return dto;
    }

    @Override
    public List<ProductVariantSizeDTO> getByVariantId(Long variantId) {
        return repository.findByVariantId(variantId)
                .stream()
                .map(this::toDTO)
                .toList();
    }
}