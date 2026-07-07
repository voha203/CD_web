package com.sneaker.backend.service.impl;

import com.sneaker.backend.config.VNPayConfig;
import com.sneaker.backend.entity.Order;
import com.sneaker.backend.entity.OrderItem;
import com.sneaker.backend.entity.ProductVariantSize;
import com.sneaker.backend.repository.OrderRepository;
import com.sneaker.backend.repository.ProductVariantSizeRepository;
import com.sneaker.backend.service.EmailService;
import com.sneaker.backend.service.PaymentService;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;
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

    @Autowired
    private EmailService emailService;

    @Override
    public String createVNPayOrder(Long orderId, String bankCode, HttpServletRequest request) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.BAD_REQUEST, "KhÃ´ng tÃ¬m tháº¥y Ä‘Æ¡n hÃ ng"));

        if ("COD".equals(order.getPaymentMethod())) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "ÄÆ¡n COD khÃ´ng cáº§n thanh toÃ¡n online");
        }

        if ("CANCELLED".equals(order.getStatus())) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "ÄÆ¡n hÃ ng Ä‘Ã£ bá»‹ há»§y");
        }

        if ("PAID".equals(order.getPaymentStatus())) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "ÄÆ¡n hÃ ng Ä‘Ã£ thanh toÃ¡n");
        }

        if ("REFUND_PENDING".equals(order.getPaymentStatus()) || "REFUNDED".equals(order.getPaymentStatus())) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "ÄÆ¡n hÃ ng Ä‘ang trong tráº¡ng thÃ¡i hoÃ n tiá»n");
        }

        long amount = (long) getPayableAmount(order);

        String txnRef = order.getId() + "_" + System.currentTimeMillis();

        Map<String, String> vnpParams = new HashMap<>();

        vnpParams.put("vnp_Version", "2.1.0");
        vnpParams.put("vnp_Command", "pay");
        vnpParams.put("vnp_TmnCode", VNPayConfig.vnp_TmnCode);

        // XÃC Äá»ŠNH THáºº HAY VÃ/QR
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
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "Cannot create payment signature", e);
        }
    }

    @Override
    @Transactional
    public Optional<Long> processReturn(HttpServletRequest request) {
        String responseCode = request.getParameter("vnp_ResponseCode");
        String txnRef = request.getParameter("vnp_TxnRef");

        if (!"00".equals(responseCode) || txnRef == null || txnRef.isBlank()) {
            return Optional.empty();
        }

        Long orderId;
        try {
            orderId = Long.parseLong(txnRef.split("_")[0]);
        } catch (NumberFormatException ex) {
            return Optional.empty();
        }

        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Khong tim thay don hang"));

        boolean wasPaid = "PAID".equals(order.getPaymentStatus());
        order.setPaymentStatus("PAID");
        order.setStatus("PENDING");

        orderRepository.save(order);
        if (!wasPaid) {
            emailService.sendPaymentSuccessEmail(order);
        }

        return Optional.of(orderId);
    }
    @Override
    @Transactional
    public Map<String, String> processIpn(HttpServletRequest request) {
        Map<String, String> result = new HashMap<>();

        try {
            // Láº¥y toÃ n bá»™ tham sá»‘ VNPay gá»­i qua URL
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

            // Táº¡o chuá»—i hashData tá»« cÃ¡c tham sá»‘ (Sáº¯p xáº¿p theo Alphabet y nhÆ° lÃºc táº¡o URL)
            List<String> fieldNames = new ArrayList<>(fields.keySet());
            Collections.sort(fieldNames);
            StringBuilder hashData = new StringBuilder();
            Iterator<String> itr = fieldNames.iterator();

            while (itr.hasNext()) {
                String fieldName = itr.next();
                String fieldValue = fields.get(fieldName);
                if ((fieldValue != null) && (fieldValue.length() > 0)) {
                    // MÃ£ hÃ³a URL
                    hashData.append(fieldName).append("=")
                            .append(URLEncoder.encode(fieldValue, StandardCharsets.US_ASCII));
                    if (itr.hasNext()) {
                        hashData.append("&");
                    }
                }
            }

            // XÃ¡c thá»±c chá»¯ kÃ½
            String signValue = hmacSHA512(VNPayConfig.secretKey, hashData.toString());

            if (!signValue.equals(vnp_SecureHash)) {
                result.put("RspCode", "97");
                result.put("Message", "Invalid Checksum");
                return result;
            }

            // Kiá»ƒm tra Ä‘Æ¡n hÃ ng cÃ³ tá»“n táº¡i khÃ´ng
            String orderIdStr = request.getParameter("vnp_TxnRef").split("_")[0];
            Long orderId = Long.parseLong(orderIdStr);
            Optional<Order> orderOptional = orderRepository.findById(orderId);

            if (orderOptional.isEmpty()) {
                result.put("RspCode", "01");
                result.put("Message", "Order not found");
                return result;
            }

            Order order = orderOptional.get();

            // Kiá»ƒm tra sá»‘ tiá»n
            double vnp_Amount = Double.parseDouble(request.getParameter("vnp_Amount")) / 100;
            if (Double.compare(getPayableAmount(order), vnp_Amount) != 0) {
                result.put("RspCode", "04");
                result.put("Message", "Invalid Amount");
                return result;
            }

            // Kiá»ƒm tra tráº¡ng thÃ¡i Ä‘Æ¡n hÃ ng (Chá»‰ xá»­ lÃ½ náº¿u Ä‘Æ¡n Ä‘ang lÃ  PENDING)
            if (!"PENDING".equals(order.getStatus())) {
                result.put("RspCode", "02");
                result.put("Message", "Order already confirmed");
                return result;
            }

            // Kiá»ƒm tra mÃ£ pháº£n há»“i thanh toÃ¡n tá»« VNPay
            String responseCode = request.getParameter("vnp_ResponseCode");
            if ("00".equals(responseCode)) {
                boolean wasPaid = "PAID".equals(order.getPaymentStatus());
                // Thanh toÃ¡n thÃ nh cÃ´ng
                order.setPaymentStatus("PAID");
                order.setStatus("PENDING");
                if (!wasPaid) {
                    emailService.sendPaymentSuccessEmail(order);
                }
            } else {
                // Thanh toÃ¡n tháº¥t báº¡i
                order.setPaymentStatus("FAILED");
            }

            // LÆ°u láº¡i tráº¡ng thÃ¡i má»›i vÃ o DB
            orderRepository.save(order);

            // Tráº£ vá» thÃ´ng bÃ¡o thÃ nh cÃ´ng cho VNPay dá»«ng gá»i ngáº§m
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
