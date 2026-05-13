import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './Checkout.css';

import { getCart } from "../../services/cartService";
import { placeOrder } from "../../services/orderService";
import { useCart } from "../../context/CartContext";
import { getProfile } from "../../services/authService";

function Checkout() {
    const [activeStep, setActiveStep] = useState(1);
    const [isSecurePopupOpen, setIsSecurePopupOpen] = useState(false);

    const navigate = useNavigate();
    const { fetchCartCount } = useCart();

    const [cartData, setCartData] = useState(null);
    const [formData, setFormData] = useState({
        receiverName: '',
        receiverPhone: '',
        shippingAddress: '',
        paymentMethod: 'COD',
        note: '',
    });

    useEffect(() => {
        // Lấy dữ liệu giỏ hàng
        const fetchCartSummary = async () => {
            const res = await getCart();
            setCartData(res.data);
        };

        // Lấy dữ liệu người dùng để điền sẵn
        const fetchUserProfile = async () => {
            try {
                const res = await getProfile();
                const { fullName, phone, address } = res.data;

                // Cập nhật formData với thông tin từ Database
                setFormData(prev => ({
                    ...prev,
                    receiverName: fullName || '',
                    receiverPhone: phone || '',
                    shippingAddress: address || ''
                }));
            } catch (err) {
                console.log("User chưa cập nhật profile hoặc lỗi server");
            }
        };

        fetchCartSummary();
        fetchUserProfile();
    }, []);

    // Cập nhật hàm thay đổi input chung
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    // Hàm xử lý chọn phương thức thanh toán
    const handlePaymentChange = (value) => {
        setFormData(prev => ({
            ...prev,
            paymentMethod: value
        }));
    };

    // Hàm xử lý Đặt hàng cuối cùng
    const handlePlaceOrder = async () => {
        try {
            if (!formData.receiverName || !formData.receiverPhone || !formData.shippingAddress) {
                alert("Vui lòng nhập đầy đủ thông tin giao hàng!");
                setActiveStep(1);
                return;
            }

            const res = await placeOrder(formData);
            alert("Đặt hàng thành công! Mã đơn hàng: " + res.data.orderId);
            fetchCartCount();
            navigate('/thank-you');
        } catch (err) {
            alert("Lỗi: " + (err.response?.data || "Không thể đặt hàng"));
        }
    };

    // Kiểm tra người dùng có đồng ý các điều khoản trước khi đặt hàng
    const [isAgreed, setIsAgreed] = useState(false);

    return (
        <div className="checkout-page-container">
            <header className="header">

                {/* NavBar trên */}
                <div className="nav-main">

                    {/* Cụm logo */}
                    <a href="/" className="nav-item">
                        <span className="logo-text">mysneaker</span>
                    </a>

                    <div className="secure-checkout-container">
                        <div
                            className="checkout-text"
                            onClick={() => setIsSecurePopupOpen(!isSecurePopupOpen)}
                        >
                            <h2 className="checkout-title">Secure checkout</h2>
                            <svg width="25" height="25" fill="currentColor" viewBox="0 0 24 24" style={{ marginLeft: '4px', marginBottom: '2px', color: 'white' }}>
                                <path d="M7 10l5 5 5-5z"></path>
                            </svg>
                        </div>

                        {isSecurePopupOpen && (
                            <div className="secure-popup-box">
                                <button
                                    className="close-popup-btn"
                                    onClick={() => setIsSecurePopupOpen(false)}
                                >
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                        <line x1="18" y1="6" x2="6" y2="18"></line>
                                        <line x1="6" y1="6" x2="18" y2="18"></line>
                                    </svg>
                                </button>
                                <p>
                                    We secure your payment and personal information when you share or save it with us. We don't share payment details with third-party sellers. We don't sell your information to others. <a href="/learn-more">Learn more</a>
                                </p>
                            </div>
                        )}
                    </div>

                    {/* Giỏ hàng */}
                    <div className="nav-item">
                        <div className="cart-container">
                            <svg width="36" height="36" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"></path>
                            </svg>
                        </div>
                        <span className="cart-text">Cart</span>
                    </div>

                </div>

            </header>

            <main className="checkout-main-content">
                {/* CỘT TRÁI: CÁC BƯỚC THANH TOÁN */}
                <div className="checkout-steps-column">

                    {/* ĐỊA CHỈ GIAO HÀNG */}
                    <div className={`checkout-step ${activeStep === 1 ? 'active' : ''}`}>
                        <div className="step-header" onClick={() => setActiveStep(1)}>
                            <h3>1. Địa chỉ giao hàng (Shipping address)</h3>
                            {activeStep !== 1 && <button className="change-btn">Thay đổi</button>}
                        </div>
                        {activeStep === 1 && (
                            <div className="step-body">
                                <form className="address-form">
                                    <div className="form-group">
                                        <label>Họ và tên</label>
                                        <input
                                            name="receiverName"
                                            value={formData.receiverName}
                                            onChange={handleChange}
                                            type="text"
                                            placeholder="Nhập họ và tên..."
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label>Số điện thoại</label>
                                        <input
                                            name="receiverPhone"
                                            value={formData.receiverPhone}
                                            onChange={handleChange}
                                            type="tel"
                                            placeholder="Nhập số điện thoại..."
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label>Địa chỉ cụ thể</label>
                                        <textarea
                                            name="shippingAddress"
                                            value={formData.shippingAddress}
                                            onChange={handleChange}
                                            type="text"
                                            placeholder="Số nhà, tên đường, tòa nhà, phường/xã..."
                                            rows="3"
                                        ></textarea>
                                    </div>
                                    <button
                                        type="button"
                                        className="use-address-btn"
                                        onClick={() => setActiveStep(2)}
                                    >
                                        Dùng địa chỉ này
                                    </button>
                                </form>
                            </div>
                        )}
                    </div>

                    {/* PHƯƠNG THỨC THANH TOÁN */}
                    <div className={`checkout-step ${activeStep === 2 ? 'active' : ''}`}>
                        <div className="step-header" onClick={() => setActiveStep(2)}>
                            <h3>2. Phương thức thanh toán (Payment method)</h3>
                            {activeStep !== 2 && <button className="change-btn">Thay đổi</button>}
                        </div>
                        {activeStep === 2 && (
                            <div className="step-body">
                                <div className="payment-options">
                                    <label className="radio-label">
                                        <input
                                            type="radio"
                                            name="payment"
                                            defaultChecked
                                            checked={formData.paymentMethod === 'COD'}
                                            onChange={() => handlePaymentChange('COD')}
                                        />
                                        Thanh toán khi nhận hàng (COD)
                                    </label>
                                    <label className="radio-label">
                                        <input
                                            type="radio"
                                            name="payment"
                                            checked={formData.paymentMethod === 'CARD'}
                                            onChange={() => handlePaymentChange('CARD')}
                                        />
                                        Thẻ tín dụng / Ghi nợ (Credit / Debit Card)
                                    </label>
                                    <label className="radio-label">
                                        <input
                                            type="radio"
                                            name="payment"
                                            checked={formData.paymentMethod === 'E-WALLET'}
                                            onChange={() => handlePaymentChange('E-WALLET')}
                                        />
                                        Ví điện tử Momo / ZaloPay
                                    </label>
                                </div>
                                <button
                                    type="button"
                                    className="use-payment-btn"
                                    onClick={() => setActiveStep(3)}
                                >
                                    Dùng phương thức này
                                </button>
                            </div>
                        )}
                    </div>

                    {/* KIỂM TRA ĐƠN HÀNG */}
                    <div className={`checkout-step ${activeStep === 3 ? 'active' : ''}`}>
                        <div className="step-header" onClick={() => setActiveStep(3)}>
                            <h3>3. Kiểm tra sản phẩm và vận chuyển (Review items)</h3>
                        </div>
                        {activeStep === 3 && (
                            <div className="step-body">
                                <div className="review-items-list">
                                    {cartData?.items.map((item, index) => (
                                        <div className="review-item" key={index}>
                                            <img src={item.images[0]?.imageUrl} alt={item.productName} />
                                            <div className="review-item-info">
                                                <h4>{item.productName}</h4>
                                                <p>Size: {item.sizeValue} | Màu: {item.color}</p>
                                                <p>Số lượng: {item.quantity}</p>
                                                <strong className="text-red">
                                                    {(item.price * item.quantity).toLocaleString('vi-VN')}₫
                                                </strong>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* CỘT PHẢI: TỔNG KẾT ĐƠN HÀNG (ORDER SUMMARY) */}
                <div className="checkout-summary-column">
                    <div className="summary-box">

                        {/* Nút đặt hàng */}
                        <button
                            className={`place-order-btn ${!isAgreed ? 'btn-disabled' : ''}`}
                            onClick={handlePlaceOrder}
                            disabled={!isAgreed} // Chỉ cho phép ấn khi isAgreed === true
                        >
                            Đặt hàng (Place your order)
                        </button>

                        {/* Ô tích xác nhận */}
                        <div className="agreement-checkbox-container" style={{ marginBottom: '15px', display: 'flex', alignItems: 'flex-start' }}>
                            <input
                                type="checkbox"
                                id="agree-terms"
                                checked={isAgreed}
                                onChange={(e) => setIsAgreed(e.target.checked)}
                                style={{ marginTop: '4px', marginRight: '10px', cursor: 'pointer' }}
                            />
                            <label htmlFor="agree-terms" style={{ fontSize: '14px', cursor: 'pointer', lineHeight: '1.4' }}>
                                Bằng việc đặt hàng, bạn đồng ý với các Điều khoản sử dụng và Chính sách bảo mật của chúng tôi.
                            </label>
                        </div>

                        <div className="summary-divider"></div>

                        <h3>Order Summary</h3>
                        <div className="summary-row">
                            <span>Tạm tính ({cartData?.items.length} món):</span>
                            <span>{cartData?.totalPrice.toLocaleString('vi-VN')}₫</span>
                        </div>
                        <div className="summary-row">
                            <span>Phí vận chuyển (Shipping):</span>
                            <span>30.000₫</span>
                        </div>
                        <div className="summary-row text-red">
                            <span>Khuyến mãi (Promotion):</span>
                            <span>-30.000₫</span>
                        </div>

                        <div className="summary-divider"></div>

                        <div className="summary-row total-row">
                            <span>Tổng cộng (Order total):</span>
                            <span>
                                {(cartData?.totalPrice || 0).toLocaleString('vi-VN')}₫
                            </span>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}

export default Checkout;