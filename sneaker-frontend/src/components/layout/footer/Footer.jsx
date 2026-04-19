import React from 'react';
import './Footer.css';

function Footer() {
    const scrollToTop = () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    };

    return (
        <footer className="footer-container">
            {/* THANH "BACK TO TOP" */}
            <div className="back-to-top" onClick={scrollToTop}>
                Back to top
            </div>

            <div className="footer-content">
                {/* Thông tin thương hiệu */}
                <div className="footer-brand">
                    <span className="footer-logo">mysneaker</span>
                    <p>
                        Tự hào là đơn vị cung cấp Sneaker chính hãng hàng đầu.
                        Chúng tôi mang đến những đôi giày chất lượng nhất để bạn
                        khẳng định phong cách riêng trên mọi bước chân.
                    </p>
                </div>

                {/* Danh mục mua sắm */}
                <div className="footer-column">
                    <h4 className="footer-heading">Mua sắm</h4>
                    <ul className="footer-links">
                        <li><a href="#">Giày Nam</a></li>
                        <li><a href="#">Giày Nữ</a></li>
                        <li><a href="#">Hàng Mới Về</a></li>
                        <li><a href="#">Khuyến Mãi</a></li>
                    </ul>
                </div>

                {/* Hỗ trợ khách hàng */}
                <div className="footer-column">
                    <h4 className="footer-heading">Hỗ trợ</h4>
                    <ul className="footer-links">
                        <li><a href="#">Kiểm tra đơn hàng</a></li>
                        <li><a href="#">Chính sách đổi trả</a></li>
                        <li><a href="#">Hệ thống cửa hàng</a></li>
                        <li><a href="#">Liên hệ hỗ trợ</a></li>
                    </ul>
                </div>

                {/* Đăng ký nhận tin */}
                <div className="footer-newsletter">
                    <h4 className="footer-heading">Đăng ký nhận tin</h4>
                    <p>Nhận ngay voucher giảm giá 10% cho đơn hàng đầu tiên của bạn.</p>
                    <form className="newsletter-form" onSubmit={(e) => e.preventDefault()}>
                        <input type="email" placeholder="Email của bạn..." />
                        <button type="submit">Gửi</button>
                    </form>
                </div>

            </div>

            {/* Phần bản quyền dưới cùng */}
            <div className="footer-bottom">
                <p>© 2026 mysneaker. All Rights Reserved.</p>
            </div>
        </footer>
    );
}

export default Footer;