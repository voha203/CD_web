package com.sneaker.backend.mapper;

import com.sneaker.backend.dto.order.OrderDTO;
import com.sneaker.backend.dto.orderItem.OrderItemDTO;
import com.sneaker.backend.entity.Order;
import com.sneaker.backend.entity.OrderItem;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

import java.util.List;

@Mapper(componentModel = "spring")
public interface OrderMapper {

    // ================= ORDER =================
    @Mapping(source = "id", target = "orderId")
    OrderDTO toDTO(Order order);

    List<OrderItemDTO> toItemDTOList(List<OrderItem> items);

    // ================= ORDER ITEM =================
    @Mapping(source = "variantSize.variant.product.id", target = "productId")
    @Mapping(source = "variantSize.variant.product.name", target = "productName")
    @Mapping(source = "variantSize.variant.color", target = "color")
    @Mapping(source = "variantSize.size.value", target = "sizeValue")

    // QUAN TRỌNG: Không map giá từ product. Lấy trực tiếp từ OrderItem!
    @Mapping(source = "price", target = "price")

    // Dùng Java Expression để tính Subtotal và lấy ảnh đầu tiên (nếu DTO của bạn cần 1 ảnh duy nhất)
    @Mapping(target = "subTotal", expression = "java(item.getPrice() * item.getQuantity())")
    @Mapping(source = "variantSize.variant.images", target = "images")
    OrderItemDTO toItemDTO(OrderItem item);
}