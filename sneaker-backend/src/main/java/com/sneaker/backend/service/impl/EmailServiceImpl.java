package com.sneaker.backend.service.impl;

import com.sneaker.backend.service.EmailService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
public class EmailServiceImpl implements EmailService {

    @Autowired
    private JavaMailSender mailSender;

    @Override
    public void sendOtpEmail(String toEmail, String otp) {
        SimpleMailMessage message = new SimpleMailMessage();

        message.setTo(toEmail);
        message.setSubject("Mã OTP đặt lại mật khẩu - MySneaker");
        message.setText(
                "Xin chào,\n\n" +
                        "Mã OTP đặt lại mật khẩu của bạn là: " + otp + "\n\n" +
                        "Mã này có hiệu lực trong 5 phút.\n\n" +
                        "Nếu bạn không yêu cầu đặt lại mật khẩu, vui lòng bỏ qua email này.\n\n" +
                        "MySneaker"
        );

        mailSender.send(message);
    }
}