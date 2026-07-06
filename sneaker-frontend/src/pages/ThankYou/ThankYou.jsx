import React, { useEffect, useRef, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import {
    FiArrowRight,
    FiCheckCircle,
    FiChevronLeft,
    FiChevronRight,
    FiHome,
    FiShoppingBag
} from 'react-icons/fi';

import ProductCard from '../../components/layout/productCard/ProductCard';
import { getOrderById } from '../../services/orderService';
import './ThankYou.css';

function ThankYou() {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const orderId = searchParams.get('orderId');
    const scrollContainerRef = useRef(null);

    const [orderData, setOrderData] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [recommendedProducts, setRecommendedProducts] = useState([]);

    useEffect(() => {
        if (!orderId) {
            setError('Không tìm thấy mã đơn hàng hợp lệ.');
            setIsLoading(false);
            return;
        }

        setIsLoading(true);
        setError(null);

        getOrderById(orderId)
            .then((res) => {
                setOrderData(res.data);
            })
            .catch((err) => {
                setError(err.response?.data || err.message || 'Không thể tải thông tin đơn hàng.');
            })
            .finally(() => {
                setIsLoading(false);
            });

        fetch(`http://localhost:8080/api/products/recommendations?orderId=${orderId}`)
            .then((response) => {
                if (!response.ok) throw new Error('Could not load recommendations');
                return response.json();
            })
            .then((data) => {
                setRecommendedProducts(data);
            })
            .catch((err) => {
                console.error('Could not load recommendations:', err);
            });
    }, [orderId]);

    const handleScroll = (direction) => {
        const container = scrollContainerRef.current;
        if (!container) return;

        const scrollAmount = container.clientWidth;
        container.scrollBy({
            left: direction === 'left' ? -scrollAmount : scrollAmount,
            behavior: 'smooth'
        });
    };

    const getPaymentDetails = (method, status, paymentStatus) => {
        const configs = {
            CARD: {
                methodLabel: 'Thẻ tín dụng / Thẻ ghi nợ',
                statusLabel: paymentStatus === 'PAID' ? 'Đã thanh toán - chờ xác nhận' : 'Chưa thanh toán',
                note: paymentStatus === 'PAID'
                    ? 'Đơn hàng của bạn đã được thanh toán trực tuyến thành công. Shop sẽ kiểm tra và xác nhận đơn.'
                    : 'Bạn có thể thanh toán lại trong phần chi tiết đơn hàng.'
            },
            'E-WALLET': {
                methodLabel: 'Ví điện tử',
                statusLabel: paymentStatus === 'PAID' ? 'Đã thanh toán - chờ xác nhận' : 'Chưa thanh toán',
                note: paymentStatus === 'PAID'
                    ? 'Giao dịch ví điện tử đã hoàn tất. Shop sẽ kiểm tra và xác nhận đơn.'
                    : 'Bạn có thể thanh toán lại trong phần chi tiết đơn hàng.'
            },
            COD: {
                methodLabel: 'Thanh toán khi nhận hàng (COD)',
                statusLabel: 'Chờ xử lý',
                note: 'Vui lòng chuẩn bị số tiền cần thanh toán khi đơn hàng được giao.'
            }
        };

        return configs[method] || {
            methodLabel: 'Phương thức khác',
            statusLabel: status,
            note: 'Chúng tôi sẽ liên hệ lại để xác nhận đơn hàng.'
        };
    };

    if (isLoading) {
        return (
            <div className="thankyou-page-container">
                <h2>Đang tải thông tin đơn hàng...</h2>
            </div>
        );
    }

    if (error) {
        return (
            <div className="thankyou-page-container">
                <h2>Có lỗi xảy ra: {error}</h2>
            </div>
        );
    }

    if (!orderData) return null;

    const paymentDetails = getPaymentDetails(orderData.paymentMethod, orderData.status, orderData.paymentStatus);

    return (
        <div className="thankyou-page-container">
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
                        <strong>#MS-{orderData.orderId}</strong>
                    </div>
                    <div className="order-summary-row">
                        <span>Thời gian đặt:</span>
                        <span>
                            {orderData.createdAt
                                ? new Date(orderData.createdAt).toLocaleString('vi-VN')
                                : new Date().toLocaleString('vi-VN')}
                        </span>
                    </div>
                    <div className="order-summary-row">
                        <span>Trạng thái:</span>
                        <span className="status-badge">{paymentDetails.statusLabel}</span>
                    </div>
                    <div className="order-summary-row">
                        <span>Phương thức:</span>
                        <span>{paymentDetails.methodLabel}</span>
                    </div>

                    <div className="order-summary-divider"></div>

                    <div className="order-summary-row total-row">
                        <span>Tổng thanh toán:</span>
                        <span className="total-price">
                            {(orderData.totalAmount || 0).toLocaleString('vi-VN')} VND
                        </span>
                    </div>

                    <p className="note-text">{paymentDetails.note}</p>
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
                        onClick={() => navigate('/orders')}
                    >
                        <FiShoppingBag /> Xem đơn hàng của tôi
                    </button>
                </div>
            </div>

            {recommendedProducts.length > 0 && (
                <div className="recommendation-section">
                    <div className="recommendation-header">
                        <h2>Có thể bạn cũng thích</h2>
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
            )}
        </div>
    );
}

export default ThankYou;
