import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { FiCheckCircle, FiChevronLeft, FiCreditCard, FiMapPin, FiPackage, FiTruck } from 'react-icons/fi';
import { getOrderById } from '../../services/orderService';
import './OrderDetail.css';

const getImageUrl = (images = []) => {
    const imageUrl = images[0]?.imageUrl;
    if (!imageUrl) return 'https://via.placeholder.com/300';
    return imageUrl.startsWith('http') ? imageUrl : `http://localhost:8080${imageUrl}`;
};

const formatDateTime = (value) => {
    if (!value) return 'N/A';
    return new Date(value).toLocaleString('vi-VN');
};

const getPaymentLabel = (method) => {
    const labels = {
        COD: 'Thanh toán khi nhận hàng (COD)',
        CARD: 'Thẻ tín dụng / Thẻ ghi nợ',
        'E-WALLET': 'Ví điện tử'
    };

    return labels[method] || method || 'N/A';
};

const getStatusLabel = (status) => {
    const labels = {
        PENDING: 'Chờ xử lý',
        PROCESSING: 'Đang chuẩn bị hàng',
        SHIPPED: 'Đang giao hàng',
        DELIVERED: 'Đã giao thành công',
        CANCELLED: 'Đã hủy',
        FAILED: 'Thanh toán thất bại'
    };

    return labels[status] || status || 'N/A';
};

function OrderDetail() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [order, setOrder] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        getOrderById(id)
            .then((res) => {
                setOrder(res.data);
            })
            .catch((err) => {
                setError(err.response?.data || err.message || 'Không thể tải chi tiết đơn hàng.');
            })
            .finally(() => {
                setIsLoading(false);
            });
    }, [id]);

    const steps = [
        { key: 'PENDING', label: 'Chờ xử lý', icon: <FiPackage /> },
        { key: 'PROCESSING', label: 'Đang chuẩn bị', icon: <FiPackage /> },
        { key: 'SHIPPED', label: 'Đang giao hàng', icon: <FiTruck /> },
        { key: 'DELIVERED', label: 'Đã giao thành công', icon: <FiCheckCircle /> }
    ];

    const currentStepIndex = Math.max(steps.findIndex(step => step.key === order?.status), 0);
    const subtotal = (order?.items || []).reduce((sum, item) => sum + (item.subTotal || item.price * item.quantity), 0);

    if (isLoading) {
        return (
            <div className="order-detail-container">
                <div className="detail-layout">Đang tải chi tiết đơn hàng...</div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="order-detail-container">
                <div className="detail-layout">
                    <button className="back-to-orders-btn" onClick={() => navigate('/orders')}>
                        <FiChevronLeft /> Quay lại danh sách đơn hàng
                    </button>
                    {error}
                </div>
            </div>
        );
    }

    if (!order) return null;

    return (
        <div className="order-detail-container">
            <div className="detail-layout">
                <button className="back-to-orders-btn" onClick={() => navigate('/orders')}>
                    <FiChevronLeft /> Quay lại danh sách đơn hàng
                </button>

                <div className="detail-header">
                    <div>
                        <h1>Chi tiết đơn hàng</h1>
                        <p className="order-meta-text">
                            Đặt ngày {formatDateTime(order.createdAt)} - Mã đơn hàng: <span>#MS-{order.orderId}</span>
                        </p>
                    </div>
                    <button className="btn-print" onClick={() => window.print()}>In hóa đơn</button>
                </div>

                <section className="invoice-header-card">
                    <div className="invoice-brand-block">
                        <div className="invoice-logo">mysneaker</div>
                        <p>Giày sneaker chính hãng</p>
                        <p>Email: support@mysneaker.vn</p>
                        <p>Hotline: 1900 0000</p>
                    </div>

                    <div className="invoice-meta-block">
                        <h2>Hóa đơn bán hàng</h2>
                        <p><span>Mã hóa đơn:</span> #MS-{order.orderId}</p>
                        <p><span>Ngày lập:</span> {formatDateTime(order.createdAt)}</p>
                        <p><span>Trạng thái:</span> {getStatusLabel(order.status)}</p>
                    </div>
                </section>

                <div className="timeline-card">
                    <div className="timeline-track">
                        {steps.map((step, index) => {
                            let statusClass = '';
                            if (index < currentStepIndex) statusClass = 'completed';
                            else if (index === currentStepIndex) statusClass = 'active';

                            return (
                                <div key={step.key} className={`timeline-step ${statusClass}`}>
                                    <div className="step-icon-box">{step.icon}</div>
                                    <span className="step-label">{step.label}</span>
                                </div>
                            );
                        })}
                    </div>
                </div>

                <div className="info-grid">
                    <div className="info-block">
                        <h3 className="block-title"><FiMapPin /> Địa chỉ nhận hàng</h3>
                        <div className="block-content">
                            <strong>{order.receiverName}</strong>
                            <p>{order.receiverPhone}</p>
                            <p>{order.shippingAddress}</p>
                        </div>
                    </div>

                    <div className="info-block">
                        <h3 className="block-title"><FiCreditCard /> Phương thức thanh toán</h3>
                        <div className="block-content">
                            <p>{getPaymentLabel(order.paymentMethod)}</p>
                            <p>Trạng thái: {getStatusLabel(order.status)}</p>
                        </div>
                    </div>
                </div>

                <div className="detail-products-card">
                    <h3 className="card-inner-title">Sản phẩm đã mua</h3>

                    <table className="invoice-items-table">
                        <thead>
                            <tr>
                                <th>Sản phẩm</th>
                                <th>Màu</th>
                                <th>Size</th>
                                <th>Số lượng</th>
                                <th>Đơn giá</th>
                                <th>Thành tiền</th>
                            </tr>
                        </thead>
                        <tbody>
                            {(order.items || []).map((item) => {
                                const lineTotal = item.subTotal || item.price * item.quantity;

                                return (
                                    <tr key={`invoice-${item.productId}-${item.sizeValue}-${item.color}`}>
                                        <td>{item.productName}</td>
                                        <td>{item.color}</td>
                                        <td>{item.sizeValue}</td>
                                        <td>{item.quantity}</td>
                                        <td>{item.price.toLocaleString('vi-VN')} VND</td>
                                        <td>{lineTotal.toLocaleString('vi-VN')} VND</td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>

                    <div className="products-list-wrapper">
                        {(order.items || []).map((item) => (
                            <div key={`${item.productId}-${item.sizeValue}-${item.color}`} className="detail-product-item">
                                <div className="detail-img-box">
                                    <img src={getImageUrl(item.images)} alt={item.productName} />
                                </div>
                                <div className="detail-info-box-right">
                                    <div>
                                        <h4>{item.productName}</h4>
                                        <p className="item-meta">Màu: {item.color} | Size: {item.sizeValue}</p>
                                        <p className="item-qty">Số lượng: {item.quantity}</p>
                                    </div>
                                    <span className="item-price">
                                        {(item.subTotal || item.price * item.quantity).toLocaleString('vi-VN')} VND
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="cost-summary-wrapper">
                        <div className="cost-row">
                            <span>Tạm tính</span>
                            <span>{subtotal.toLocaleString('vi-VN')} VND</span>
                        </div>
                        <div className="cost-row">
                            <span>Phí vận chuyển</span>
                            <span>0 VND</span>
                        </div>
                        <div className="cost-row">
                            <span>Giảm giá</span>
                            <span>0 VND</span>
                        </div>
                        <div className="cost-row total-cost-row">
                            <span>Tổng cộng</span>
                            <span>{(order.totalAmount || 0).toLocaleString('vi-VN')} VND</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default OrderDetail;
