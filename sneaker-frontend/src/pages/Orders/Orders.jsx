import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiBox, FiCheck, FiChevronRight, FiTruck } from 'react-icons/fi';
import { getMyOrders } from '../../services/orderService';
import './Orders.css';

const getImageUrl = (images = []) => {
    const imageUrl = images[0]?.imageUrl;
    if (!imageUrl) return 'https://via.placeholder.com/300';
    return imageUrl.startsWith('http') ? imageUrl : `http://localhost:8080${imageUrl}`;
};

const formatDate = (value) => {
    if (!value) return 'N/A';
    return new Date(value).toLocaleDateString('vi-VN', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
    });
};

const getStatusText = (status) => {
    const labels = {
        PENDING: 'Cho thanh toan / xu ly',
        PROCESSING: 'Dang chuan bi hang',
        SHIPPED: 'Dang giao hang',
        DELIVERED: 'Giao hang thanh cong',
        CANCELLED: 'Da huy',
        FAILED: 'Thanh toan that bai'
    };

    return labels[status] || status || 'N/A';
};

function Orders() {
    const navigate = useNavigate();
    const [orders, setOrders] = useState([]);
    const [activeTab, setActiveTab] = useState('ALL');
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        getMyOrders()
            .then((res) => {
                setOrders(res.data || []);
            })
            .catch((err) => {
                setError(err.response?.data || err.message || 'Khong the tai danh sach don hang.');
            })
            .finally(() => {
                setIsLoading(false);
            });
    }, []);

    const filteredOrders = useMemo(() => {
        if (activeTab === 'ALL') return orders;
        return orders.filter((order) => order.status === activeTab);
    }, [activeTab, orders]);

    const renderStatusIcon = (status) => {
        switch (status) {
            case 'DELIVERED':
                return <FiCheck className="status-icon delivered" />;
            case 'PROCESSING':
            case 'PENDING':
                return <FiBox className="status-icon processing" />;
            default:
                return <FiTruck className="status-icon" />;
        }
    };

    return (
        <div className="orders-page-container">
            <div className="orders-layout">
                <div className="orders-header-section">
                    <h1 className="orders-main-title">Don hang cua ban</h1>
                    <div className="orders-tabs">
                        <button className={`tab-btn ${activeTab === 'ALL' ? 'active' : ''}`} onClick={() => setActiveTab('ALL')}>
                            Tat ca don
                        </button>
                        <button className={`tab-btn ${activeTab === 'PENDING' ? 'active' : ''}`} onClick={() => setActiveTab('PENDING')}>
                            Cho xu ly
                        </button>
                        <button className={`tab-btn ${activeTab === 'PROCESSING' ? 'active' : ''}`} onClick={() => setActiveTab('PROCESSING')}>
                            Dang chuan bi
                        </button>
                        <button className={`tab-btn ${activeTab === 'SHIPPED' ? 'active' : ''}`} onClick={() => setActiveTab('SHIPPED')}>
                            Dang giao
                        </button>
                        <button className={`tab-btn ${activeTab === 'DELIVERED' ? 'active' : ''}`} onClick={() => setActiveTab('DELIVERED')}>
                            Hoan thanh
                        </button>
                    </div>
                </div>

                {isLoading && <div className="orders-empty-state">Dang tai danh sach don hang...</div>}
                {error && <div className="orders-empty-state">{error}</div>}
                {!isLoading && !error && filteredOrders.length === 0 && (
                    <div className="orders-empty-state">Chua co don hang nao.</div>
                )}

                {!isLoading && !error && filteredOrders.length > 0 && (
                    <div className="orders-list">
                        {filteredOrders.map((order) => (
                            <div key={order.orderId} className="order-card">
                                <div className="order-card-header">
                                    <div className="header-info-group">
                                        <div className="header-item">
                                            <span className="label">Da dat hang</span>
                                            <span className="value">{formatDate(order.createdAt)}</span>
                                        </div>
                                        <div className="header-item">
                                            <span className="label">Tong tien</span>
                                            <span className="value">{(order.totalAmount || 0).toLocaleString('vi-VN')} VND</span>
                                        </div>
                                        <div className="header-item ship-to">
                                            <span className="label">Giao den</span>
                                            <span className="value hover-link">{order.receiverName}</span>
                                        </div>
                                    </div>
                                    <div className="header-order-id">
                                        <span className="label">Ma don hang #MS-{order.orderId}</span>
                                        <span className="value hover-link" onClick={() => navigate(`/orders/${order.orderId}`)}>
                                            Xem chi tiet don hang
                                        </span>
                                    </div>
                                </div>

                                <div className="order-card-body">
                                    <div className="order-status-banner">
                                        {renderStatusIcon(order.status)}
                                        <span className={`status-text ${(order.status || '').toLowerCase()}`}>
                                            {getStatusText(order.status)}
                                        </span>
                                    </div>

                                    {(order.items || []).map((item) => (
                                        <div key={`${order.orderId}-${item.productId}-${item.sizeValue}-${item.color}`} className="order-product-item">
                                            <div className="product-image-wrapper">
                                                <img src={getImageUrl(item.images)} alt={item.productName} />
                                            </div>
                                            <div className="product-details">
                                                <h3 className="product-name">{item.productName}</h3>
                                                <p className="product-meta">Mau: {item.color}</p>
                                                <p className="product-meta">Size: {item.sizeValue} | So luong: {item.quantity}</p>
                                                <div className="product-actions">
                                                    <button className="btn-text" onClick={() => navigate(`/products/${item.productId}`)}>
                                                        Mua lai
                                                    </button>
                                                    <div className="divider-vertical"></div>
                                                    <button className="btn-text" onClick={() => navigate(`/orders/${order.orderId}`)}>
                                                        Chi tiet <FiChevronRight />
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                <div className="order-card-footer">
                                    <button className="btn-action btn-secondary" onClick={() => navigate(`/orders/${order.orderId}`)}>
                                        Xem chi tiet
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}

export default Orders;
