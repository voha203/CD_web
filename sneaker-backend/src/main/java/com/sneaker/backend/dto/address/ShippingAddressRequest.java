package com.sneaker.backend.dto.address;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class ShippingAddressRequest {
    @NotBlank(message = "Tên người nhận không được để trống")
    @Size(max = 100, message = "Tên người nhận tối đa 100 ký tự")
    private String receiverName;

    @NotBlank(message = "Số điện thoại không được để trống")
    @Pattern(regexp = "^(0|\\+84)[0-9]{9,10}$", message = "Số điện thoại không hợp lệ")
    private String receiverPhone;

    @NotBlank(message = "Tỉnh/thành phố không được để trống")
    @Size(max = 100, message = "Tỉnh/thành phố tối đa 100 ký tự")
    private String province;

    @NotBlank(message = "Quận/huyện không được để trống")
    @Size(max = 100, message = "Quận/huyện tối đa 100 ký tự")
    private String district;

    @NotBlank(message = "Phường/xã không được để trống")
    @Size(max = 100, message = "Phường/xã tối đa 100 ký tự")
    private String ward;

    @NotBlank(message = "Địa chỉ chi tiết không được để trống")
    @Size(max = 255, message = "Địa chỉ chi tiết tối đa 255 ký tự")
    private String detailAddress;

    private Boolean isDefault;
}
