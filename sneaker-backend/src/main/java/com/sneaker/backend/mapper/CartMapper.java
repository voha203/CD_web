package com.sneaker.backend.mapper;

import com.sneaker.backend.dto.cart.CartDTO;
import com.sneaker.backend.dto.cartItem.CartItemDTO;
import com.sneaker.backend.entity.Cart;
import com.sneaker.backend.entity.CartItem;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

import java.util.List;

@Mapper(componentModel = "spring")
public interface CartMapper {

    // ================= CART =================
    CartDTO toDTO(Cart cart);

    List<CartItemDTO> toItemDTOList(List<CartItem> items);

    // ================= CART ITEM =================
    @Mapping(source = "variantSize.id", target = "variantSizeId")
    @Mapping(source = "variantSize.variant.color", target = "color")
    @Mapping(source = "variantSize.size.value", target = "sizeValue")
    @Mapping(source = "variantSize.variant.images", target = "images")
    CartItemDTO toItemDTO(CartItem item);
}