package com.sneaker.backend.mapper;

import com.sneaker.backend.dto.cart.CartResponse;
import com.sneaker.backend.dto.cartItem.CartItemResponse;
import com.sneaker.backend.entity.Cart;
import com.sneaker.backend.entity.CartItem;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

import java.util.List;

@Mapper(componentModel = "spring")
public interface CartMapper {

    // ================= CART =================
    CartResponse toDTO(Cart cart);

    List<CartItemResponse> toItemDTOList(List<CartItem> items);

    // ================= CART ITEM =================
    @Mapping(source = "variantSize.id", target = "variantSizeId")
    @Mapping(source = "variantSize.variant.color", target = "color")
    @Mapping(source = "variantSize.size.value", target = "sizeValue")
    @Mapping(source = "variantSize.variant.product.name", target = "productName")
    @Mapping(source = "variantSize.variant.product.brand", target = "brand")
    @Mapping(source = "variantSize.variant.product.price", target = "price")
    @Mapping(source = "variantSize.variant.images", target = "images")
    CartItemResponse toItemDTO(CartItem item);
}