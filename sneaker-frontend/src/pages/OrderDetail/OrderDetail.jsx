import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FiChevronLeft, FiMapPin, FiCreditCard, FiPackage, FiTruck, FiCheckCircle } from 'react-icons/fi';
import './OrderDetail.css';

function OrderDetail() {
    const { id } = useParams();
    const navigate = useNavigate();

    // Giả lập lấy dữ liệu chi tiết của đơn hàng dựa vào ID
    const order = {
        id: id || 'MS-847291',
        date: '28 Thg 06, 2026',
        status: 'SHIPPED', // PROCESSING, SHIPPED, DELIVERED
        shippingAddress: {
            name: 'Nguyễn Văn A',
            phone: '0901234567',
            address: '123 Đường Lê Lợi, Phường Bến Thành, Quận 1, TP. Hồ Chí Minh'
        },
        paymentMethod: 'Thanh toán khi nhận hàng (COD)',
        summary: {
            subtotal: 5550000,
            shipping: 30000,
            discount: 0,
            total: 5580000
        },
        items: [
            {
                id: 1,
                name: "Nike Air Force 1 '07 All White",
                category: "Men's Shoes",
                size: "42",
                quantity: 1,
                price: 2950000,
                image: "https://images.unsplash.com/photo-1600185365483-26d7a4cc7519?w=300&q=80"
            },
            {
                id: 2,
                name: "Adidas Originals Superstar Black",
                category: "Unisex Sneakers",
                size: "41",
                quantity: 1,
                price: 2600000,
                image: "https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=300&q=80"
            }
        ]
    };

    // Định nghĩa các bước của Timeline
    const steps = [
        { key: 'PROCESSING', label: 'Đang xử lý', icon: <FiPackage /> },
        { key: 'SHIPPED', label: 'Đang giao hàng', icon: <FiTruck /> },
        { key: 'DELIVERED', label: 'Đã giao thành công', icon: <FiCheckCircle /> }
    ];

    // Tính toán xem tiến trình đang ở bước nào
    const currentStepIndex = steps.findIndex(step => step.key === order.status);

    return (
        <div className="order-detail-container">
            <div className="detail-layout">

                {/* NÚT QUAY LẠI */}
                <button className="back-to-orders-btn" onClick={() => navigate('/orders')}>
                    <FiChevronLeft /> Quay lại danh sách đơn hàng
                </button>

                {/* HEADER ĐƠN HÀNG */}
                <div className="detail-header">
                    <div>
                        <h1>Chi tiết đơn hàng</h1>
                        <p className="order-meta-text">Đặt ngày {order.date} • Mã đơn hàng: <span>{order.id}</span></p>
                    </div>
                    <button className="btn-print" onClick={() => window.print()}>In hóa đơn</button>
                </div>

                {/* THANH TIẾN TRÌNH */}
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

                {/* KHỐI THÔNG TIN GIAO NHẬN VÀ THANH TOÁN */}
                <div className="info-grid">
                    <div className="info-block">
                        <h3 className="block-title"><FiMapPin /> Địa chỉ nhận hàng</h3>
                        <div className="block-content">
                            <strong>{order.shippingAddress.name}</strong>
                            <p>{order.shippingAddress.phone}</p>
                            <p>{order.shippingAddress.address}</p>
                        </div>
                    </div>

                    <div className="info-block">
                        <h3 className="block-title"><FiCreditCard /> Phương thức thanh toán</h3>
                        <div className="block-content">
                            <p>{order.paymentMethod}</p>
                        </div>
                    </div>
                </div>

                {/* DANH SÁCH SẢN PHẨM VÀ TỔNG TIỀN */}
                <div className="detail-products-card">
                    <h3 className="card-inner-title">Sản phẩm đã mua</h3>

                    <div className="products-list-wrapper">
                        {order.items.map((item, index) => (
                            <div key={index} className="detail-product-item">
                                <div className="detail-img-box">
                                    <img src={item.image} alt={item.name} />
                                </div>
                                <div className="detail-info-box-right">
                                    <div>
                                        <h4>{item.name}</h4>
                                        <p className="item-meta">{item.category} | Size: {item.size}</p>
                                        <p className="item-qty">Số lượng: {item.quantity}</p>
                                    </div>
                                    <span className="item-price">{(item.price * item.quantity).toLocaleString('vi-VN')} ₫</span>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* TÓM TẮT CHI PHÍ */}
                    <div className="cost-summary-wrapper">
                        <div className="cost-row">
                            <span>Tạm tính</span>
                            <span>{order.summary.subtotal.toLocaleString('vi-VN')} ₫</span>
                        </div>
                        <div className="cost-row">
                            <span>Phí vận chuyển</span>
                            <span>{order.summary.shipping.toLocaleString('vi-VN')} ₫</span>
                        </div>
                        <div className="cost-row">
                            <span>Giảm giá</span>
                            <span>-{order.summary.discount.toLocaleString('vi-VN')} ₫</span>
                        </div>
                        <div className="cost-row total-cost-row">
                            <span>Tổng cộng</span>
                            <span>{order.summary.total.toLocaleString('vi-VN')} ₫</span>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
}

export default OrderDetail;