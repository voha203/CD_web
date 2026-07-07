import React, { useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { FiRefreshCcw, FiSearch, FiX } from 'react-icons/fi';
import { getApiErrorMessage } from '../../services/apiError';
import {
    confirmAdminRefund,
    getAdminOrderById,
    getAdminOrders,
    updateAdminOrderStatus,
    updateAdminPaymentStatus
} from '../../services/adminService';
import { resolveAssetUrl } from '../../config/apiConfig';
import './AdminOrders.css';

const orderStatuses = ['ALL', 'PENDING', 'PROCESSING', 'SHIPPED', 'DELIVERED', 'CANCELLED'];
const paymentStatuses = ['ALL', 'UNPAID', 'PAID', 'COD_PENDING', 'FAILED', 'REFUND_PENDING', 'REFUNDED'];

const statusLabels = {
    PENDING: 'Chờ xử lý',
    PROCESSING: 'Đang xử lý',
    SHIPPED: 'Đang giao',
    DELIVERED: 'Đã giao',
    CANCELLED: 'Đã hủy'
};

const paymentLabels = {
    UNPAID: 'Chưa thanh toán',
    PAID: 'Đã thanh toán',
    COD_PENDING: 'COD',
    FAILED: 'Thất bại',
    REFUND_PENDING: 'Chờ hoàn tiền',
    REFUNDED: 'Đã hoàn tiền'
};

const formatMoney = (value) => `${Number(value || 0).toLocaleString('vi-VN')}₫`;
const formatDateTime = (value) => value ? new Date(value).toLocaleString('vi-VN') : 'N/A';

const getImageUrl = (images = []) => {
    const imageUrl = images[0]?.imageUrl;
    if (!imageUrl) return 'https://via.placeholder.com/300';
    return resolveAssetUrl(imageUrl);
};

function AdminOrders() {
    const [searchParams] = useSearchParams();
    const [orders, setOrders] = useState([]);
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [status, setStatus] = useState('ALL');
    const [paymentStatus, setPaymentStatus] = useState('ALL');
    const [keyword, setKeyword] = useState(searchParams.get('orderId') || '');
    const [cancelReason, setCancelReason] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const [isDetailLoading, setIsDetailLoading] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [error, setError] = useState('');
    const [message, setMessage] = useState('');

    const requestParams = useMemo(() => ({
        status: status === 'ALL' ? undefined : status,
        paymentStatus: paymentStatus === 'ALL' ? undefined : paymentStatus,
        keyword: keyword.trim() || undefined
    }), [status, paymentStatus, keyword]);

    const loadOrders = async () => {
        setIsLoading(true);
        setError('');

        try {
            const res = await getAdminOrders(requestParams);
            setOrders(res.data || []);
        } catch (err) {
            setError(getApiErrorMessage(err, 'Không thể tải danh sách đơn hàng.'));
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        loadOrders();
    }, [status, paymentStatus]);

    useEffect(() => {
        const orderId = searchParams.get('orderId');
        if (orderId) {
            setKeyword(orderId);
        }
    }, [searchParams]);

    const handleSearch = (e) => {
        e.preventDefault();
        loadOrders();
    };

    const openDetail = async (orderId) => {
        setIsDetailLoading(true);
        setError('');
        setMessage('');

        try {
            const res = await getAdminOrderById(orderId);
            setSelectedOrder(res.data);
            setCancelReason('');
        } catch (err) {
            setError(getApiErrorMessage(err, 'Không thể tải chi tiết đơn hàng.'));
        } finally {
            setIsDetailLoading(false);
        }
    };

    const refreshSelectedOrder = async (orderId) => {
        const res = await getAdminOrderById(orderId);
        setSelectedOrder(res.data);
    };

    const handleUpdateStatus = async (nextStatus) => {
        if (!selectedOrder) return;

        if (nextStatus === 'CANCELLED' && !cancelReason.trim()) {
            setError('Vui lòng nhập lý do hủy trước khi chuyển đơn sang Đã hủy.');
            return;
        }

        setIsSaving(true);
        setError('');
        setMessage('');

        try {
            await updateAdminOrderStatus(selectedOrder.orderId, {
                status: nextStatus,
                cancelReason: nextStatus === 'CANCELLED' ? cancelReason : undefined
            });
            setMessage('Cập nhật trạng thái đơn hàng thành công.');
            await refreshSelectedOrder(selectedOrder.orderId);
            await loadOrders();
        } catch (err) {
            setError(getApiErrorMessage(err, 'Không thể cập nhật trạng thái đơn hàng.'));
        } finally {
            setIsSaving(false);
        }
    };

    const handleUpdatePaymentStatus = async (nextStatus) => {
        if (!selectedOrder) return;

        setIsSaving(true);
        setError('');
        setMessage('');

        try {
            await updateAdminPaymentStatus(selectedOrder.orderId, { paymentStatus: nextStatus });
            setMessage('Cập nhật trạng thái thanh toán thành công.');
            await refreshSelectedOrder(selectedOrder.orderId);
            await loadOrders();
        } catch (err) {
            setError(getApiErrorMessage(err, 'Không thể cập nhật trạng thái thanh toán.'));
        } finally {
            setIsSaving(false);
        }
    };

    const handleConfirmRefund = async () => {
        if (!selectedOrder) return;

        setIsSaving(true);
        setError('');
        setMessage('');

        try {
            await confirmAdminRefund(selectedOrder.orderId);
            setMessage('Đã xác nhận hoàn tiền.');
            await refreshSelectedOrder(selectedOrder.orderId);
            await loadOrders();
        } catch (err) {
            setError(getApiErrorMessage(err, 'Không thể xác nhận hoàn tiền.'));
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <main className="admin-orders-page">
            <div className="admin-page-heading">
                <div>
                    <h1>Quản lý đơn hàng</h1>
                    <p>Lọc, xem chi tiết và cập nhật trạng thái đơn hàng.</p>
                </div>
                <button type="button" onClick={loadOrders} disabled={isLoading}>
                    <FiRefreshCcw /> Làm mới
                </button>
            </div>

            {error && <div className="admin-alert error">{error}</div>}
            {message && <div className="admin-alert success">{message}</div>}

            <section className="admin-order-filters">
                <form onSubmit={handleSearch} className="admin-order-search">
                    <FiSearch />
                    <input
                        value={keyword}
                        onChange={(e) => setKeyword(e.target.value)}
                        placeholder="Tìm mã đơn, username, người nhận, số điện thoại..."
                    />
                    <button type="submit">Tìm</button>
                </form>

                <label>
                    <span>Trạng thái đơn</span>
                    <select value={status} onChange={(e) => setStatus(e.target.value)}>
                        {orderStatuses.map(item => (
                            <option key={item} value={item}>{item === 'ALL' ? 'Tất cả' : statusLabels[item]}</option>
                        ))}
                    </select>
                </label>

                <label>
                    <span>Thanh toán</span>
                    <select value={paymentStatus} onChange={(e) => setPaymentStatus(e.target.value)}>
                        {paymentStatuses.map(item => (
                            <option key={item} value={item}>{item === 'ALL' ? 'Tất cả' : paymentLabels[item]}</option>
                        ))}
                    </select>
                </label>
            </section>

            <section className="admin-orders-table-card">
                {isLoading && <div className="admin-empty">Đang tải đơn hàng...</div>}
                {!isLoading && orders.length === 0 && <div className="admin-empty">Không có đơn hàng phù hợp.</div>}

                {!isLoading && orders.length > 0 && (
                    <div className="admin-orders-table-wrap">
                        <table className="admin-orders-table">
                            <thead>
                                <tr>
                                    <th>Mã đơn</th>
                                    <th>Khách hàng</th>
                                    <th>Người nhận</th>
                                    <th>Tổng tiền</th>
                                    <th>Đơn hàng</th>
                                    <th>Thanh toán</th>
                                    <th>Ngày tạo</th>
                                    <th></th>
                                </tr>
                            </thead>
                            <tbody>
                                {orders.map(order => (
                                    <tr key={order.orderId}>
                                        <td><strong>#MS-{order.orderId}</strong></td>
                                        <td>
                                            <strong>{order.username}</strong>
                                            <span>{order.email}</span>
                                        </td>
                                        <td>
                                            <strong>{order.receiverName}</strong>
                                            <span>{order.receiverPhone}</span>
                                        </td>
                                        <td>
                                            {formatMoney(order.finalAmount || order.totalAmount)}
                                            <span>Ship: {order.shippingFee ? formatMoney(order.shippingFee) : 'Miễn phí'}</span>
                                        </td>
                                        <td><span className={`admin-badge status-${order.status}`}>{statusLabels[order.status] || order.status}</span></td>
                                        <td><span className={`admin-badge payment-${order.paymentStatus}`}>{paymentLabels[order.paymentStatus] || order.paymentStatus}</span></td>
                                        <td>{formatDateTime(order.createdAt)}</td>
                                        <td>
                                            <button className="table-action-btn" type="button" onClick={() => openDetail(order.orderId)}>
                                                Chi tiết
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </section>

            {(selectedOrder || isDetailLoading) && (
                <div className="admin-order-detail-overlay" role="dialog" aria-modal="true">
                    <section className="admin-order-detail-panel">
                        <div className="detail-panel-header">
                            <div>
                                <h2>Chi tiết đơn hàng {selectedOrder ? `#MS-${selectedOrder.orderId}` : ''}</h2>
                                {selectedOrder && <p>{formatDateTime(selectedOrder.createdAt)}</p>}
                            </div>
                            <button type="button" onClick={() => setSelectedOrder(null)}>
                                <FiX />
                            </button>
                        </div>

                        {isDetailLoading && <div className="admin-empty">Đang tải chi tiết...</div>}

                        {selectedOrder && !isDetailLoading && (
                            <div className="detail-panel-body">
                                <div className="admin-detail-grid">
                                    <div className="admin-detail-block">
                                        <h3>Khách hàng</h3>
                                        <p><strong>{selectedOrder.fullName || selectedOrder.username}</strong></p>
                                        <p>{selectedOrder.email}</p>
                                        <p>{selectedOrder.phone || 'Chưa có số điện thoại'}</p>
                                    </div>
                                    <div className="admin-detail-block">
                                        <h3>Nhận hàng</h3>
                                        <p><strong>{selectedOrder.receiverName}</strong></p>
                                        <p>{selectedOrder.receiverPhone}</p>
                                        <p>{selectedOrder.shippingAddress}</p>
                                    </div>
                                    <div className="admin-detail-block">
                                        <h3>Thanh toán</h3>
                                        <p>{selectedOrder.paymentMethod}</p>
                                        <span className={`admin-badge payment-${selectedOrder.paymentStatus}`}>{paymentLabels[selectedOrder.paymentStatus] || selectedOrder.paymentStatus}</span>
                                    </div>
                                    <div className="admin-detail-block">
                                        <h3>Trạng thái</h3>
                                        <span className={`admin-badge status-${selectedOrder.status}`}>{statusLabels[selectedOrder.status] || selectedOrder.status}</span>
                                        {selectedOrder.cancelReason && <p>Lý do hủy: {selectedOrder.cancelReason}</p>}
                                    </div>
                                </div>

                                <div className="admin-detail-actions">
                                    <label>
                                        <span>Cập nhật trạng thái đơn</span>
                                        <select
                                            value={selectedOrder.status}
                                            onChange={(e) => handleUpdateStatus(e.target.value)}
                                            disabled={isSaving}
                                        >
                                            {orderStatuses.filter(item => item !== 'ALL').map(item => (
                                                <option key={item} value={item}>{statusLabels[item]}</option>
                                            ))}
                                        </select>
                                    </label>

                                    <label>
                                        <span>Cập nhật thanh toán</span>
                                        <select
                                            value={selectedOrder.paymentStatus}
                                            onChange={(e) => handleUpdatePaymentStatus(e.target.value)}
                                            disabled={isSaving}
                                        >
                                            {paymentStatuses.filter(item => item !== 'ALL').map(item => (
                                                <option key={item} value={item}>{paymentLabels[item]}</option>
                                            ))}
                                        </select>
                                    </label>

                                    <label className="cancel-reason-field">
                                        <span>Lý do hủy nếu chuyển CANCELLED</span>
                                        <input
                                            value={cancelReason}
                                            onChange={(e) => setCancelReason(e.target.value)}
                                            placeholder="Ví dụ: Hết hàng, khách yêu cầu hủy..."
                                            disabled={isSaving}
                                        />
                                    </label>

                                    {selectedOrder.paymentStatus === 'REFUND_PENDING' && (
                                        <button type="button" className="refund-btn" onClick={handleConfirmRefund} disabled={isSaving}>
                                            Xác nhận hoàn tiền
                                        </button>
                                    )}
                                </div>

                                <div className="admin-detail-products">
                                    <h3>Sản phẩm</h3>
                                    {(selectedOrder.items || []).map(item => (
                                        <div key={`${item.productId}-${item.color}-${item.sizeValue}`} className="admin-detail-product">
                                            <img src={getImageUrl(item.images)} alt={item.productName} />
                                            <div>
                                                <strong>{item.productName}</strong>
                                                <span>Màu: {item.color} | Size: {item.sizeValue} | SL: {item.quantity}</span>
                                            </div>
                                            <div className="admin-detail-price">
                                                {item.originalPrice > item.price && (
                                                    <span className="old-price">{formatMoney(item.originalPrice)}</span>
                                                )}
                                                <strong>{formatMoney(item.price)}</strong>
                                                <span>{formatMoney(item.subTotal)}</span>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                <div className="admin-order-money">
                                    <div><span>Phí vận chuyển</span><strong>{selectedOrder.shippingFee ? formatMoney(selectedOrder.shippingFee) : 'Miễn phí'}</strong></div>
                                    <div><span>Tạm tính</span><strong>{formatMoney(selectedOrder.subtotalAmount)}</strong></div>
                                    <div><span>Mã giảm giá</span><strong>{selectedOrder.discountCode || 'Không có'}</strong></div>
                                    <div><span>Số tiền giảm</span><strong>-{formatMoney(selectedOrder.discountAmount)}</strong></div>
                                    <div className="total"><span>Tổng thanh toán</span><strong>{formatMoney(selectedOrder.finalAmount || selectedOrder.totalAmount)}</strong></div>
                                </div>
                            </div>
                        )}
                    </section>
                </div>
            )}
        </main>
    );
}

export default AdminOrders;
