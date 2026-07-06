package com.sneaker.backend.dto.order;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class OrderRequest {
    private Long userId;

    @NotBlank(message = "Tên người nhận không được để trống")
    @Size(max = 100, message = "Tên người nhận tối đa 100 ký tự")
    private String receiverName;

    @NotBlank(message = "Số điện thoại không được để trống")
    @Pattern(regexp = "^(0|\\+84)[0-9]{9,10}$", message = "Số điện thoại không hợp lệ")
    private String receiverPhone;

    @NotBlank(message = "Địa chỉ giao hàng không được để trống")
    @Size(max = 500, message = "Địa chỉ giao hàng tối đa 500 ký tự")
    private String shippingAddress;

    @NotBlank(message = "Phương thức thanh toán không được để trống")
    @Pattern(regexp = "^(COD|CARD|E-WALLET)$", message = "Phương thức thanh toán không hợp lệ")
    private String paymentMethod;

    @Size(max = 500, message = "Ghi chú tối đa 500 ký tự")
    private String note;
}
