import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { FiCheckCircle, FiChevronLeft, FiCreditCard, FiMapPin, FiPackage, FiTruck, FiXCircle } from 'react-icons/fi';
import { cancelOrder, getOrderById } from '../../services/orderService';
import { createPaymentUrl } from '../../services/paymentService';
import { getApiErrorMessage } from '../../services/apiError';
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

const getPaymentStatusLabel = (paymentStatus) => {
    const labels = {
        UNPAID: 'Chưa thanh toán',
        PAID: 'Đã thanh toán',
        COD_PENDING: 'Thanh toán khi nhận hàng',
        FAILED: 'Thanh toán thất bại',
        REFUND_PENDING: 'Chờ hoàn tiền',
        REFUNDED: 'Đã hoàn tiền'
    };

    return labels[paymentStatus] || paymentStatus || 'Chưa thanh toán';
};

const canPayAgain = (order) => {
    return order
        && (order.paymentMethod === 'CARD' || order.paymentMethod === 'E-WALLET')
        && (!order.paymentStatus || order.paymentStatus === 'UNPAID' || order.paymentStatus === 'FAILED')
        && order.status !== 'CANCELLED';
};

const canCancelOrder = (order) => {
    return order
        && order.status === 'PENDING'
        && order.paymentStatus !== 'REFUND_PENDING'
        && order.paymentStatus !== 'REFUNDED';
};

function OrderDetail() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [order, setOrder] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isActionLoading, setIsActionLoading] = useState(false);
    const [error, setError] = useState('');
    const [actionError, setActionError] = useState('');
    const [isCancelModalOpen, setIsCancelModalOpen] = useState(false);
    const [cancelReason, setCancelReason] = useState('');

    const loadOrder = () => {
        setIsLoading(true);
        setError('');

        return getOrderById(id)
            .then((res) => {
                setOrder(res.data);
            })
            .catch((err) => {
                setError(getApiErrorMessage(err, 'Không thể tải chi tiết đơn hàng.'));
            })
            .finally(() => {
                setIsLoading(false);
            });
    };

    useEffect(() => {
        loadOrder();
    }, [id]);

    const steps = [
        { key: 'PENDING', label: 'Chờ xử lý', icon: <FiPackage /> },
        { key: 'PROCESSING', label: 'Đang chuẩn bị', icon: <FiPackage /> },
        { key: 'SHIPPED', label: 'Đang giao hàng', icon: <FiTruck /> },
        { key: 'DELIVERED', label: 'Đã giao thành công', icon: <FiCheckCircle /> }
    ];

    const currentStepIndex = Math.max(steps.findIndex(step => step.key === order?.status), 0);
    const subtotal = (order?.items || []).reduce((sum, item) => sum + (item.subTotal || item.price * item.quantity), 0);
    const orderSubtotal = order?.subtotalAmount || subtotal;
    const orderDiscount = order?.discountAmount || 0;
    const orderFinalAmount = order?.finalAmount || order?.totalAmount || 0;

    const handlePayAgain = async () => {
        if (!canPayAgain(order)) return;

        setIsActionLoading(true);
        setActionError('');

        try {
            const bankCode = order.paymentMethod === 'CARD' ? 'NCB' : 'VNPAYQR';
            const paymentRes = await createPaymentUrl(order.orderId, bankCode);
            const paymentUrl = paymentRes.data?.paymentUrl || paymentRes.paymentUrl;

            if (!paymentUrl) {
                setActionError('Không thể tạo liên kết thanh toán VNPay.');
                return;
            }

            window.location.href = paymentUrl;
        } catch (err) {
            setActionError(getApiErrorMessage(err, 'Không thể tạo liên kết thanh toán.'));
        } finally {
            setIsActionLoading(false);
        }
    };

    const handleCancelOrder = async () => {
        const reason = cancelReason.trim();

        if (!reason) {
            setActionError('Vui lòng nhập lý do hủy đơn.');
            return;
        }

        if (reason.length > 500) {
            setActionError('Lý do hủy đơn tối đa 500 ký tự.');
            return;
        }

        setIsActionLoading(true);
        setActionError('');

        try {
            const res = await cancelOrder(order.orderId, reason);
            setOrder(res.data);
            setIsCancelModalOpen(false);
            setCancelReason('');
        } catch (err) {
            setActionError(getApiErrorMessage(err, 'Không thể hủy đơn hàng.'));
        } finally {
            setIsActionLoading(false);
        }
    };

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
                    <div className="detail-actions">
                        {canPayAgain(order) && (
                            <button className="btn-pay-again" onClick={handlePayAgain} disabled={isActionLoading}>
                                {isActionLoading ? 'Đang xử lý...' : 'Thanh toán lại'}
                            </button>
                        )}
                        {canCancelOrder(order) && (
                            <button className="btn-cancel-order" onClick={() => setIsCancelModalOpen(true)} disabled={isActionLoading}>
                                <FiXCircle /> Hủy đơn
                            </button>
                        )}
                        <button className="btn-print" onClick={() => window.print()}>In hóa đơn</button>
                    </div>
                </div>

                {actionError && <div className="order-action-error">{actionError}</div>}

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
                        <p><span>Thanh toán:</span> {getPaymentStatusLabel(order.paymentStatus)}</p>
                        {order.cancelReason && <p><span>Lý do hủy:</span> {order.cancelReason}</p>}
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
                            <p>Trạng thái đơn: {getStatusLabel(order.status)}</p>
                            <p>Trạng thái thanh toán: {getPaymentStatusLabel(order.paymentStatus)}</p>
                            {order.cancelReason && <p>Lý do hủy: {order.cancelReason}</p>}
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
                            <span>{orderSubtotal.toLocaleString('vi-VN')} VND</span>
                        </div>
                        <div className="cost-row">
                            <span>Phí vận chuyển</span>
                            <span>0 VND</span>
                        </div>
                        <div className="cost-row">
                            <span>Mã giảm giá</span>
                            <span>{order.discountCode || 'Không có'}</span>
                        </div>
                        <div className="cost-row">
                            <span>Số tiền giảm</span>
                            <span>-{orderDiscount.toLocaleString('vi-VN')} VND</span>
                        </div>
                        <div className="cost-row total-cost-row">
                            <span>Tổng thanh toán</span>
                            <span>{orderFinalAmount.toLocaleString('vi-VN')} VND</span>
                        </div>
                    </div>
                </div>
            </div>

            {isCancelModalOpen && (
                <div className="cancel-modal-overlay" role="dialog" aria-modal="true">
                    <div className="cancel-modal">
                        <h2>Hủy đơn hàng</h2>
                        <p>Vui lòng cho shop biết lý do bạn muốn hủy đơn #MS-{order.orderId}.</p>
                        <textarea
                            value={cancelReason}
                            onChange={(e) => setCancelReason(e.target.value)}
                            maxLength={500}
                            placeholder="Nhập lý do hủy đơn..."
                            rows={5}
                        />
                        <div className="cancel-modal-footer">
                            <button
                                className="btn-modal-secondary"
                                onClick={() => {
                                    setIsCancelModalOpen(false);
                                    setCancelReason('');
                                    setActionError('');
                                }}
                                disabled={isActionLoading}
                            >
                                Đóng
                            </button>
                            <button
                                className="btn-modal-danger"
                                onClick={handleCancelOrder}
                                disabled={isActionLoading}
                            >
                                {isActionLoading ? 'Đang hủy...' : 'Xác nhận hủy'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default OrderDetail;
