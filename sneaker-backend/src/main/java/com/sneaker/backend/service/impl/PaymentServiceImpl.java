package com.sneaker.backend.service.impl;

import com.sneaker.backend.config.VNPayConfig;
import com.sneaker.backend.entity.Order;
import com.sneaker.backend.entity.OrderItem;
import com.sneaker.backend.entity.ProductVariantSize;
import com.sneaker.backend.repository.OrderRepository;
import com.sneaker.backend.repository.ProductVariantSizeRepository;
import com.sneaker.backend.service.PaymentService;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import javax.crypto.Mac;
import javax.crypto.spec.SecretKeySpec;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.text.SimpleDateFormat;
import java.util.*;

@Service
public class PaymentServiceImpl implements PaymentService {

    @Autowired
    private OrderRepository orderRepository;

    @Autowired
    private ProductVariantSizeRepository variantSizeRepository;

    @Override
    public String createVNPayOrder(Long orderId, String bankCode, HttpServletRequest request) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy đơn hàng"));

        if ("COD".equals(order.getPaymentMethod())) {
            throw new RuntimeException("Đơn COD không cần thanh toán online");
        }

        if ("CANCELLED".equals(order.getStatus())) {
            throw new RuntimeException("Đơn hàng đã bị hủy");
        }

        if ("PAID".equals(order.getPaymentStatus())) {
            throw new RuntimeException("Đơn hàng đã thanh toán");
        }

        if ("REFUND_PENDING".equals(order.getPaymentStatus()) || "REFUNDED".equals(order.getPaymentStatus())) {
            throw new RuntimeException("Đơn hàng đang trong trạng thái hoàn tiền");
        }

        long amount = (long) getPayableAmount(order);

        String txnRef = order.getId() + "_" + System.currentTimeMillis();

        Map<String, String> vnpParams = new HashMap<>();

        vnpParams.put("vnp_Version", "2.1.0");
        vnpParams.put("vnp_Command", "pay");
        vnpParams.put("vnp_TmnCode", VNPayConfig.vnp_TmnCode);

        // XÁC ĐỊNH THẺ HAY VÍ/QR
        if (bankCode != null && !bankCode.isEmpty()) {
            vnpParams.put("vnp_BankCode", bankCode);
        }

        vnpParams.put("vnp_Amount", String.valueOf(amount * 100));

        vnpParams.put("vnp_CurrCode", "VND");

        vnpParams.put("vnp_TxnRef", txnRef);

        vnpParams.put("vnp_OrderInfo", "Thanh toan don hang " + order.getId());

        vnpParams.put("vnp_OrderType", "other");

        vnpParams.put("vnp_Locale", "vn");

        vnpParams.put("vnp_ReturnUrl", VNPayConfig.vnp_ReturnUrl);

        vnpParams.put("vnp_IpAddr", request.getRemoteAddr());

        SimpleDateFormat formatter = new SimpleDateFormat("yyyyMMddHHmmss");

        vnpParams.put("vnp_CreateDate", formatter.format(new Date()));

        List<String> fieldNames = new ArrayList<>(vnpParams.keySet());

        Collections.sort(fieldNames);

        StringBuilder hashData = new StringBuilder();
        StringBuilder query = new StringBuilder();

        Iterator<String> itr = fieldNames.iterator();

        while (itr.hasNext()) {

            String fieldName = itr.next();

            String value = vnpParams.get(fieldName);

            if (value != null && !value.isEmpty()) {

                String encodedValue = URLEncoder.encode(value, StandardCharsets.US_ASCII);

                hashData.append(fieldName).append("=").append(encodedValue);

                query.append(fieldName).append("=").append(encodedValue);

                if (itr.hasNext()) {
                    hashData.append("&");
                    query.append("&");
                }
            }
        }

        String secureHash = hmacSHA512(VNPayConfig.secretKey, hashData.toString());

        query.append("&vnp_SecureHash=").append(secureHash);

        return VNPayConfig.vnp_PayUrl + "?" + query;
    }

    public static String hmacSHA512(String key, String data) {
        try {
            Mac hmac512 = Mac.getInstance("HmacSHA512");

            SecretKeySpec secretKeySpec = new SecretKeySpec(key.getBytes(), "HmacSHA512");

            hmac512.init(secretKeySpec);

            byte[] bytes = hmac512.doFinal(data.getBytes(StandardCharsets.UTF_8));

            StringBuilder hash = new StringBuilder();

            for (byte b : bytes) {
                hash.append(String.format("%02x", b));
            }

            return hash.toString();

        } catch (Exception e) {
            throw new RuntimeException(e);
        }
    }

    @Override
    @Transactional
    public Map<String, String> processIpn(HttpServletRequest request) {
        Map<String, String> result = new HashMap<>();

        try {
            // Lấy toàn bộ tham số VNPay gửi qua URL
            Map<String, String> fields = new HashMap<>();
            for (Enumeration<String> params = request.getParameterNames(); params.hasMoreElements(); ) {
                String fieldName = params.nextElement();
                String fieldValue = request.getParameter(fieldName);
                if ((fieldValue != null) && (fieldValue.length() > 0)) {
                    fields.put(fieldName, fieldValue);
                }
            }

            String vnp_SecureHash = request.getParameter("vnp_SecureHash");
            fields.remove("vnp_SecureHash");
            fields.remove("vnp_SecureHashType");

            // Tạo chuỗi hashData từ các tham số (Sắp xếp theo Alphabet y như lúc tạo URL)
            List<String> fieldNames = new ArrayList<>(fields.keySet());
            Collections.sort(fieldNames);
            StringBuilder hashData = new StringBuilder();
            Iterator<String> itr = fieldNames.iterator();

            while (itr.hasNext()) {
                String fieldName = itr.next();
                String fieldValue = fields.get(fieldName);
                if ((fieldValue != null) && (fieldValue.length() > 0)) {
                    // Mã hóa URL
                    hashData.append(fieldName).append("=")
                            .append(URLEncoder.encode(fieldValue, StandardCharsets.US_ASCII));
                    if (itr.hasNext()) {
                        hashData.append("&");
                    }
                }
            }

            // Xác thực chữ ký
            String signValue = hmacSHA512(VNPayConfig.secretKey, hashData.toString());

            if (!signValue.equals(vnp_SecureHash)) {
                result.put("RspCode", "97");
                result.put("Message", "Invalid Checksum");
                return result;
            }

            // Kiểm tra đơn hàng có tồn tại không
            String orderIdStr = request.getParameter("vnp_TxnRef").split("_")[0];
            Long orderId = Long.parseLong(orderIdStr);
            Optional<Order> orderOptional = orderRepository.findById(orderId);

            if (orderOptional.isEmpty()) {
                result.put("RspCode", "01");
                result.put("Message", "Order not found");
                return result;
            }

            Order order = orderOptional.get();

            // Kiểm tra số tiền
            double vnp_Amount = Double.parseDouble(request.getParameter("vnp_Amount")) / 100;
            if (Double.compare(getPayableAmount(order), vnp_Amount) != 0) {
                result.put("RspCode", "04");
                result.put("Message", "Invalid Amount");
                return result;
            }

            // Kiểm tra trạng thái đơn hàng (Chỉ xử lý nếu đơn đang là PENDING)
            if (!"PENDING".equals(order.getStatus())) {
                result.put("RspCode", "02");
                result.put("Message", "Order already confirmed");
                return result;
            }

            // Kiểm tra mã phản hồi thanh toán từ VNPay
            String responseCode = request.getParameter("vnp_ResponseCode");
            if ("00".equals(responseCode)) {
                // Thanh toán thành công
                order.setPaymentStatus("PAID");
                order.setStatus("PENDING");
            } else {
                // Thanh toán thất bại
                order.setPaymentStatus("FAILED");
            }

            // Lưu lại trạng thái mới vào DB
            orderRepository.save(order);

            // Trả về thông báo thành công cho VNPay dừng gọi ngầm
            result.put("RspCode", "00");
            result.put("Message", "Confirm Success");

        } catch (Exception e) {
            result.put("RspCode", "99");
            result.put("Message", "Unknown error");
        }

        return result;
    }

    private double getPayableAmount(Order order) {
        return order.getFinalAmount() > 0 ? order.getFinalAmount() : order.getTotalAmount();
    }
}
