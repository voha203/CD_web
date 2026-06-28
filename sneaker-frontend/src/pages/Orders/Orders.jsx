import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FiBox, FiCheck, FiTruck, FiChevronRight } from 'react-icons/fi';
import './Orders.css';

function Orders() {
    const navigate = useNavigate();

    // Mock Data
    const mockOrders = [
        {
            id: 'MS-847291',
            date: '28 Thg 06, 2026',
            totalAmount: 5550000,
            shipTo: 'Nguyễn Văn A',
            status: 'DELIVERED',
            statusText: 'Giao hàng thành công vào 30 Thg 06',
            items: [
                {
                    id: 1,
                    name: "Nike Air Force 1 '07 All White",
                    category: "Men's Shoes",
                    size: "42",
                    price: 2950000,
                    image: "https://images.unsplash.com/photo-1600185365483-26d7a4cc7519?w=300&q=80"
                },
                {
                    id: 2,
                    name: "Adidas Originals Superstar Black",
                    category: "Unisex Sneakers",
                    size: "41",
                    price: 2600000,
                    image: "https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=300&q=80"
                }
            ]
        },
        {
            id: 'MS-102938',
            date: '15 Thg 05, 2026',
            totalAmount: 3200000,
            shipTo: 'Nguyễn Văn A',
            status: 'PROCESSING',
            statusText: 'Đang chuẩn bị hàng',
            items: [
                {
                    id: 4,
                    name: "Nike Dunk Low Retro Panda",
                    category: "Men's Shoes",
                    size: "42",
                    price: 3200000,
                    image: "https://images.unsplash.com/photo-1608231387042-66d1773070a5?w=300&q=80"
                }
            ]
        }
    ];

    // Hàm render icon trạng thái
    const renderStatusIcon = (status) => {
        switch (status) {
            case 'DELIVERED': return <FiCheck className="status-icon delivered" />;
            case 'PROCESSING': return <FiBox className="status-icon processing" />;
            default: return <FiTruck className="status-icon" />;
        }
    };

    return (
        <div className="orders-page-container">
            <div className="orders-layout">
                {/* TIÊU ĐỀ TRANG */}
                <div className="orders-header-section">
                    <h1 className="orders-main-title">Đơn hàng của bạn</h1>
                    <div className="orders-tabs">
                        <button className="tab-btn active">Tất cả đơn</button>
                        <button className="tab-btn">Chưa thanh toán</button>
                        <button className="tab-btn">Đang giao</button>
                        <button className="tab-btn">Đã hoàn thành</button>
                    </div>
                </div>

                {/* DANH SÁCH ĐƠN HÀNG */}
                <div className="orders-list">
                    {mockOrders.map((order) => (
                        <div key={order.id} className="order-card">

                            {/* HEADER */}
                            <div className="order-card-header">
                                <div className="header-info-group">
                                    <div className="header-item">
                                        <span className="label">ĐÃ ĐẶT HÀNG</span>
                                        <span className="value">{order.date}</span>
                                    </div>
                                    <div className="header-item">
                                        <span className="label">TỔNG TIỀN</span>
                                        <span className="value">{order.totalAmount.toLocaleString('vi-VN')} ₫</span>
                                    </div>
                                    <div className="header-item ship-to">
                                        <span className="label">GIAO ĐẾN</span>
                                        <span className="value hover-link">{order.shipTo}</span>
                                    </div>
                                </div>
                                <div className="header-order-id">
                                    <span className="label">MÃ ĐƠN HÀNG # {order.id}</span>
                                    <span className="value hover-link" onClick={() => navigate(`/orders/${order.id}`)}>
                                        Xem chi tiết đơn hàng
                                    </span>
                                </div>
                            </div>

                            {/* BODY */}
                            <div className="order-card-body">
                                <div className="order-status-banner">
                                    {renderStatusIcon(order.status)}
                                    <span className={`status-text ${order.status.toLowerCase()}`}>
                                        {order.statusText}
                                    </span>
                                </div>

                                {order.items.map((item, index) => (
                                    <div key={index} className="order-product-item">
                                        <div className="product-image-wrapper">
                                            <img src={item.image} alt={item.name} />
                                        </div>
                                        <div className="product-details">
                                            <h3 className="product-name">{item.name}</h3>
                                            <p className="product-meta">{item.category}</p>
                                            <p className="product-meta">Size: {item.size}</p>
                                            <div className="product-actions">
                                                <button className="btn-text" onClick={() => navigate(`/products/${item.id}`)}>
                                                    Mua lại
                                                </button>
                                                <div className="divider-vertical"></div>
                                                <button className="btn-text">Xem sản phẩm</button>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* NÚT HÀNH ĐỘNG */}
                            <div className="order-card-footer">
                                <button className="btn-action btn-secondary">Theo dõi kiện hàng</button>
                                <button className="btn-action btn-secondary">Yêu cầu đổi/trả</button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

export default Orders;