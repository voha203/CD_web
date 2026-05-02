package com.sneaker.backend.mapper;

import com.sneaker.backend.dto.product.ProductDTO;
import com.sneaker.backend.dto.productVariant.ProductVariantDTO;
import com.sneaker.backend.dto.productVariantSize.ProductVariantSizeDTO;
import com.sneaker.backend.entity.Product;
import com.sneaker.backend.entity.ProductVariant;
import com.sneaker.backend.entity.ProductVariantSize;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface ProductMapper {

    @Mapping(source = "category.id", target = "categoryId")
    ProductDTO toDTO(Product product);

    ProductVariantDTO toVariantDTO(ProductVariant variant);

    @Mapping(source = "variant.id", target = "variantId")
    @Mapping(source = "size.id", target = "sizeId")
    @Mapping(source = "size.value", target = "sizeValue")
    ProductVariantSizeDTO toSizeDTO(ProductVariantSize size);
}