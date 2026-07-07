package com.sneaker.backend.service.impl;

import com.sneaker.backend.entity.Order;
import com.sneaker.backend.service.EmailService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
public class EmailServiceImpl implements EmailService {
    private static final Logger log = LoggerFactory.getLogger(EmailServiceImpl.class);

    @Autowired
    private JavaMailSender mailSender;

    @Value("${spring.mail.username:}")
    private String fromEmail;

    @Override
    public void sendOtpEmail(String toEmail, String otp) {
        safeSend(toEmail,
                "Mã OTP đặt lại mật khẩu - MySneaker",
                "Xin chào,\n\n"
                        + "Mã OTP đặt lại mật khẩu của bạn là: " + otp + "\n\n"
                        + "Mã này có hiệu lực trong 5 phút.\n\n"
                        + "Nếu bạn không yêu cầu đặt lại mật khẩu, vui lòng bỏ qua email này.\n\n"
                        + "MySneaker");
    }

    @Override
    public void sendOrderPlacedEmail(Order order) {
        safeSend(order.getUser().getEmail(),
                "MySneaker đã nhận đơn hàng #" + order.getId(),
                buildOrderEmail(order, "Đơn hàng của bạn đã được tạo thành công."));
    }

    @Override
    public void sendPaymentSuccessEmail(Order order) {
        safeSend(order.getUser().getEmail(),
                "Thanh toán thành công cho đơn hàng #" + order.getId(),
                buildOrderEmail(order, "MySneaker đã ghi nhận thanh toán thành công cho đơn hàng của bạn."));
    }

    @Override
    public void sendOrderCancelledEmail(Order order) {
        safeSend(order.getUser().getEmail(),
                "Đơn hàng #" + order.getId() + " đã được hủy",
                buildOrderEmail(order, "Đơn hàng của bạn đã được hủy. Nếu đơn đã thanh toán, shop sẽ xử lý hoàn tiền theo trạng thái đơn."));
    }

    private void safeSend(String toEmail, String subject, String text) {
        if (toEmail == null || toEmail.trim().isEmpty()) {
            return;
        }

        try {
            SimpleMailMessage message = new SimpleMailMessage();
            if (fromEmail != null && !fromEmail.isBlank()) {
                message.setFrom(fromEmail);
            }
            message.setTo(toEmail);
            message.setSubject(subject);
            message.setText(text);
            mailSender.send(message);
        } catch (Exception ex) {
            log.warn("Could not send email to {}: {}", maskEmail(toEmail), ex.getMessage());
        }
    }

    private String buildOrderEmail(Order order, String intro) {
        return "Xin chào " + safe(order.getReceiverName()) + ",\n\n"
                + intro + "\n\n"
                + "Mã đơn hàng: #MS-" + order.getId() + "\n"
                + "Người nhận: " + safe(order.getReceiverName()) + "\n"
                + "Địa chỉ giao hàng: " + safe(order.getShippingAddress()) + "\n"
                + "Tạm tính: " + formatMoney(order.getSubtotalAmount()) + "\n"
                + "Giảm giá: " + formatMoney(order.getDiscountAmount()) + "\n"
                + "Phí vận chuyển: " + formatMoney(order.getShippingFee()) + "\n"
                + "Tổng thanh toán: " + formatMoney(order.getFinalAmount() > 0 ? order.getFinalAmount() : order.getTotalAmount()) + "\n"
                + "Phương thức thanh toán: " + safe(order.getPaymentMethod()) + "\n"
                + "Trạng thái đơn: " + safe(order.getStatus()) + "\n"
                + "Trạng thái thanh toán: " + safe(order.getPaymentStatus()) + "\n\n"
                + "Cảm ơn bạn đã mua sắm tại MySneaker.";
    }

    private String formatMoney(double value) {
        return String.format("%,.0f VND", value);
    }

    private String safe(String value) {
        return value == null ? "N/A" : value;
    }

    private String maskEmail(String email) {
        int at = email.indexOf('@');
        if (at <= 1) return "***";
        return email.charAt(0) + "***" + email.substring(at);
    }
}
