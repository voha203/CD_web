package com.sneaker.backend.mapper;

import com.sneaker.backend.dto.product.ProductResponse;
import com.sneaker.backend.dto.productVariant.ProductVariantResponse;
import com.sneaker.backend.dto.productVariantSize.ProductVariantSizeResponse;
import com.sneaker.backend.entity.Product;
import com.sneaker.backend.entity.ProductVariant;
import com.sneaker.backend.entity.ProductVariantSize;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface ProductMapper {

    @Mapping(source = "category.id", target = "categoryId")
    ProductResponse toDTO(Product product);

    ProductVariantResponse toVariantDTO(ProductVariant variant);

    @Mapping(source = "variant.id", target = "variantId")
    @Mapping(source = "size.id", target = "sizeId")
    @Mapping(source = "size.value", target = "sizeValue")
    ProductVariantSizeResponse toSizeDTO(ProductVariantSize size);
}