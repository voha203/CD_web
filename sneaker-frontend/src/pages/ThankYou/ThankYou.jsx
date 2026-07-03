import React, { useRef, useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
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

    // Lấy orderId từ tham số trên URL
    const [searchParams] = useSearchParams();
    const orderId = searchParams.get('orderId');

    // State để lưu dữ liệu đơn hàng và trạng thái tải
    const [orderData, setOrderData] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    // State lưu dữ liệu danh sách sản phẩm gợi ý
    const [recommendedProducts, setRecommendedProducts] = useState([]);

    useEffect(() => {
        if (orderId) {
            fetch(`http://localhost:8080/api/orders/${orderId}`)
                .then((response) => {
                    if (!response.ok) throw new Error("Không thể tải thông tin đơn hàng");
                    return response.json();
                })
                .then((data) => {
                    setOrderData(data);
                    setIsLoading(false);
                })
                .catch((err) => {
                    setError(err.message);
                    setIsLoading(false);
                });

            fetch(`http://localhost:8080/api/products/recommendations?orderId=${orderId}`)
                .then((response) => {
                    if (!response.ok) throw new Error("Lỗi khi tải gợi ý");
                    return response.json();
                })
                .then((data) => {
                    setRecommendedProducts(data);
                    setIsLoading(false);
                })
                .catch((err) => {
                    setError(err.message);
                    setIsLoading(false);
                });

        } else {
            setError("Không tìm thấy mã đơn hàng hợp lệ.");
            setIsLoading(false);
        }
    }, [orderId]);

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

    // Xử lý giao diện khi đang tải hoặc có lỗi
    if (isLoading) return <div className="thankyou-page-container"><h2>Đang tải thông tin đơn hàng...</h2></div>;
    if (error) return <div className="thankyou-page-container"><h2>Có lỗi xảy ra: {error}</h2></div>;
    if (!orderData) return null;

    // Hàm xử lý nội dung theo thuộc tính paymentMethod lấy được (CARD, E-WALLET, COD)
    const getPaymentDetails = (method, status) => {
        const configs = {
            'CARD': {
                methodLabel: 'Thẻ tín dụng / Thẻ ghi nợ',
                statusLabel: status === 'PROCESSING' ? 'Đã thanh toán' : 'Chờ xác thực thẻ',
                note: 'Đơn hàng của bạn đã được thanh toán trực tuyến thành công bằng Thẻ. Hóa đơn chi tiết đã được gửi về email của bạn.'
            },
            'E-WALLET': {
                methodLabel: 'Ví điện tử',
                statusLabel: status === 'PROCESSING' ? 'Đã thanh toán' : 'Chờ ví phản hồi',
                note: 'Giao dịch qua ví điện tử đã hoàn tất. Cảm ơn bạn đã lựa chọn hình thức thanh toán không tiền mặt!'
            },
            'COD': {
                methodLabel: 'Thanh toán khi nhận hàng (COD)',
                statusLabel: 'Chờ xử lý & Giao hàng',
                note: 'Vui lòng chuẩn bị sẵn số tiền mặt tương ứng để thanh toán cho shipper khi đơn hàng được giao đến bạn.'
            }
        };

        return configs[method] || {
            methodLabel: 'Phương thức khác',
            statusLabel: status,
            note: 'Chúng tôi sẽ liên hệ lại qua số điện thoại để xác nhận đơn hàng trong thời gian sớm nhất.'
        };
    };

    // Lấy thông tin tương ứng với đơn hàng hiện tại
    const paymentDetails = getPaymentDetails(orderData.paymentMethod, orderData.status);

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
                        <strong>#MS-{orderData.orderId}</strong>
                    </div>
                    <div className="order-summary-row">
                        <span>Thời gian đặt:</span>
                        <span>{orderData.createdAt ? new Date(orderData.createdAt).toLocaleString('vi-VN') : new Date().toLocaleString('vi-VN')}</span>
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
                            {orderData.totalAmount ? orderData.totalAmount.toLocaleString('vi-VN') : 0} ₫
                        </span>
                    </div>

                    <p className="note-text">
                        {paymentDetails.note}
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
                        onClick={() => navigate('/orders')}
                    >
                        <FiShoppingBag /> Xem đơn hàng của tôi
                    </button>
                </div>
            </div>

            {/* DANH SÁCH SẢN PHẨM GỢI Ý */}
            {recommendedProducts && recommendedProducts.length > 0 && (
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
            )}
        </div>
    );
}

export default ThankYou;