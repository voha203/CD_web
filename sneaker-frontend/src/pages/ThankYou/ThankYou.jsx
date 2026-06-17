import React, { useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    FiCheckCircle,
    FiShoppingBag,
    FiHome,
    FiArrowRight,
    FiChevronLeft,
    FiChevronRight
} from 'react-icons/fi';

import ProductCard from '../../components/layout/productCard/ProductCard';
import './ThankYou.css';

function ThankYou() {
    const navigate = useNavigate();

    // Mã đơn hàng ngẫu nhiên để test
    const orderCode = Math.floor(100000 + Math.random() * 900000);

    // Điều khiển cuộn danh sách sản phẩm
    const scrollContainerRef = useRef(null);

    // Xử lý bấm nút mũi tên trái/phải
    const handleScroll = (direction) => {
        const container = scrollContainerRef.current;
        if (container) {
            const scrollAmount = container.clientWidth;
            if (direction === 'left') {
                container.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
            } else {
                container.scrollBy({ left: scrollAmount, behavior: 'smooth' });
            }
        }
    };

    // Mock data
    const recommendedProducts = [
        {
            id: 1,
            name: "Nike Air Force 1 '07 All White",
            brand: "Nike",
            price: 2950000,
            isNew: true,
            variants: [{ images: [{ imageUrl: "https://images.unsplash.com/photo-1600185365483-26d7a4cc7519?w=500&q=80", isMain: true }] }]
        },
        {
            id: 2,
            name: "Adidas Originals Superstar Black",
            brand: "Adidas",
            price: 2600000,
            oldPrice: 3000000,
            salePercentage: 15,
            variants: [{ images: [{ imageUrl: "https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=500&q=80", isMain: true }] }]
        },
        {
            id: 3,
            name: "Jordan 1 Low 'Wolf Grey'",
            brand: "Nike",
            price: 3850000,
            isNew: true,
            variants: [{ images: [{ imageUrl: "https://images.unsplash.com/photo-1556906781-9a412961c28c?w=500&q=80", isMain: true }] }]
        },
        {
            id: 4,
            name: "Nike Dunk Low Retro Panda",
            brand: "Nike",
            price: 3200000,
            variants: [{ images: [{ imageUrl: "https://images.unsplash.com/photo-1608231387042-66d1773070a5?w=500&q=80", isMain: true }] }]
        },
        {
            id: 5,
            name: "New Balance 550 'White Green'",
            brand: "New Balance",
            price: 3500000,
            oldPrice: 4000000,
            salePercentage: 12,
            variants: [{ images: [{ imageUrl: "https://images.unsplash.com/photo-1539185441755-769473a23570?w=500&q=80", isMain: true }] }]
        },
        {
            id: 6,
            name: "Puma Suede Classic XXI",
            brand: "Puma",
            price: 1850000,
            variants: [{ images: [{ imageUrl: "https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?w=500&q=80", isMain: true }] }]
        },
        {
            id: 7,
            name: "Vans Old Skool Core Classics",
            brand: "Vans",
            price: 1750000,
            variants: [{ images: [{ imageUrl: "https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=500&q=80", isMain: true }] }]
        }
    ];

    return (
        <div className="thankyou-page-container">

            {/* THẺ CẢM ƠN CHÍNH */}
            <div className="thankyou-card">
                <div className="success-icon-wrapper">
                    <FiCheckCircle className="success-icon" />
                </div>

                <h1 className="thankyou-title">Đặt hàng thành công!</h1>
                <p className="thankyou-subtitle">
                    Cảm ơn bạn đã tin tưởng và mua sắm tại <strong>mysneaker</strong>.
                </p>

                <div className="order-info-box">
                    <h3 className="order-summary-title">Tóm tắt đơn hàng</h3>

                    <div className="order-summary-row">
                        <span>Mã đơn hàng:</span>
                        <strong>#MS-{orderCode}</strong>
                    </div>
                    <div className="order-summary-row">
                        <span>Thời gian đặt:</span>
                        <span>{new Date().toLocaleString('vi-VN')}</span>
                    </div>
                    <div className="order-summary-row">
                        <span>Trạng thái:</span>
                        <span className="status-badge">Đang xử lý</span>
                    </div>
                    <div className="order-summary-row">
                        <span>Phương thức:</span>
                        <span>Thanh toán khi nhận hàng (COD)</span>
                    </div>

                    <div className="order-summary-divider"></div>

                    <div className="order-summary-row total-row">
                        <span>Tổng thanh toán:</span>
                        <span className="total-price">5.550.000 ₫</span>
                    </div>

                    <p className="note-text">
                        Một email xác nhận kèm chi tiết hóa đơn đã được gửi đến email của bạn.
                        Chúng tôi sẽ liên hệ lại qua số điện thoại để xác nhận giao hàng trong thời gian sớm nhất.
                    </p>
                </div>

                <div className="thankyou-actions">
                    <button
                        className="btn-action btn-secondary"
                        onClick={() => navigate('/products')}
                    >
                        <FiHome /> Tiếp tục mua sắm
                    </button>
                    <button
                        className="btn-action btn-primary"
                        onClick={() => navigate('/account/orders')}
                    >
                        <FiShoppingBag /> Xem đơn hàng của tôi
                    </button>
                </div>
            </div>

            {/* DANH SÁCH SẢN PHẨM GỢI Ý */}
            <div className="recommendation-section">
                <div className="recommendation-header">
                    <h2>Có thể bạn cũng thích (You may also like)</h2>
                    <a href="/products" className="view-all-link">
                        Xem tất cả <FiArrowRight />
                    </a>
                </div>

                <div className="slider-wrapper">
                    <button className="nav-btn nav-btn-left" onClick={() => handleScroll('left')}>
                        <FiChevronLeft />
                    </button>

                    <div className="thankyou-products-grid" ref={scrollContainerRef}>
                        {recommendedProducts.map((product) => (
                            <div key={product.id} className="slider-item">
                                <ProductCard product={product} />
                            </div>
                        ))}
                    </div>

                    <button className="nav-btn nav-btn-right" onClick={() => handleScroll('right')}>
                        <FiChevronRight />
                    </button>
                </div>
            </div>
        </div>
    );
}

export default ThankYou;