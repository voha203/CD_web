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
            setError('Khong tim thay ma don hang hop le.');
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
                setError(err.response?.data || err.message || 'Khong the tai thong tin don hang.');
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

    const getPaymentDetails = (method, status) => {
        const configs = {
            CARD: {
                methodLabel: 'The tin dung / The ghi no',
                statusLabel: status === 'PROCESSING' ? 'Da thanh toan' : 'Cho xac thuc the',
                note: 'Don hang cua ban da duoc thanh toan truc tuyen thanh cong.'
            },
            'E-WALLET': {
                methodLabel: 'Vi dien tu',
                statusLabel: status === 'PROCESSING' ? 'Da thanh toan' : 'Cho vi phan hoi',
                note: 'Giao dich qua vi dien tu da hoan tat.'
            },
            COD: {
                methodLabel: 'Thanh toan khi nhan hang (COD)',
                statusLabel: 'Cho xu ly va giao hang',
                note: 'Vui long chuan bi so tien can thanh toan khi don hang duoc giao.'
            }
        };

        return configs[method] || {
            methodLabel: 'Phuong thuc khac',
            statusLabel: status,
            note: 'Chung toi se lien he lai de xac nhan don hang.'
        };
    };

    if (isLoading) {
        return (
            <div className="thankyou-page-container">
                <h2>Dang tai thong tin don hang...</h2>
            </div>
        );
    }

    if (error) {
        return (
            <div className="thankyou-page-container">
                <h2>Co loi xay ra: {error}</h2>
            </div>
        );
    }

    if (!orderData) return null;

    const paymentDetails = getPaymentDetails(orderData.paymentMethod, orderData.status);

    return (
        <div className="thankyou-page-container">
            <div className="thankyou-card">
                <div className="success-icon-wrapper">
                    <FiCheckCircle className="success-icon" />
                </div>

                <h1 className="thankyou-title">Dat hang thanh cong!</h1>
                <p className="thankyou-subtitle">
                    Cam on ban da tin tuong va mua sam tai <strong>mysneaker</strong>.
                </p>

                <div className="order-info-box">
                    <h3 className="order-summary-title">Tom tat don hang</h3>

                    <div className="order-summary-row">
                        <span>Ma don hang:</span>
                        <strong>#MS-{orderData.orderId}</strong>
                    </div>
                    <div className="order-summary-row">
                        <span>Thoi gian dat:</span>
                        <span>
                            {orderData.createdAt
                                ? new Date(orderData.createdAt).toLocaleString('vi-VN')
                                : new Date().toLocaleString('vi-VN')}
                        </span>
                    </div>
                    <div className="order-summary-row">
                        <span>Trang thai:</span>
                        <span className="status-badge">{paymentDetails.statusLabel}</span>
                    </div>
                    <div className="order-summary-row">
                        <span>Phuong thuc:</span>
                        <span>{paymentDetails.methodLabel}</span>
                    </div>

                    <div className="order-summary-divider"></div>

                    <div className="order-summary-row total-row">
                        <span>Tong thanh toan:</span>
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
                        <FiHome /> Tiep tuc mua sam
                    </button>
                    <button
                        className="btn-action btn-primary"
                        onClick={() => navigate('/orders')}
                    >
                        <FiShoppingBag /> Xem don hang cua toi
                    </button>
                </div>
            </div>

            {recommendedProducts.length > 0 && (
                <div className="recommendation-section">
                    <div className="recommendation-header">
                        <h2>Co the ban cung thich</h2>
                        <a href="/products" className="view-all-link">
                            Xem tat ca <FiArrowRight />
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
