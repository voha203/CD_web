import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './Checkout.css';

import { getCart } from "../../services/cartService";
import { placeOrder } from "../../services/orderService";
import { useCart } from "../../context/CartContext";
import { getProfile } from "../../services/authService";
import { createPaymentUrl } from "../../services/paymentService"

function Checkout() {
    const [activeStep, setActiveStep] = useState(1);
    const [isSecurePopupOpen, setIsSecurePopupOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [errors, setErrors] = useState({});

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
            try {
                const res = await getCart();
                setCartData(res.data);
            } catch (err) {
                console.error("Lỗi lấy giỏ hàng:", err)
            }
        };

        // Lấy dữ liệu người dùng để điền sẵn
        const fetchUserProfile = async () => {
            try {
                const res = await getProfile();
                const { fullName, phone, address } = res.data || {};

                // Cập nhật formData với thông tin từ Database
                setFormData(prev => ({
                    ...prev,
                    receiverName: fullName || '',
                    receiverPhone: phone || '',
                    shippingAddress: address || ''
                }));
            } catch (err) {
                console.log("User chưa cập nhật profile hoặc lỗi server");
            } finally {
                setIsLoading(false);
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

        // Xóa thông báo lỗi khi người dùng bắt đầu nhập lại
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: '' }));
        }
    };

    // Hàm xử lý chọn phương thức thanh toán
    const handlePaymentChange = (value) => {
        setFormData(prev => ({
            ...prev,
            paymentMethod: value
        }));
    };

    // Hàm kiểm tra hợp lệ của địa chỉ trước khi sang bước tiếp theo
    const validateAddressStep = () => {
        const newErrors = {};
        if (!formData.receiverName.trim()) newErrors.receiverName = "Vui lòng nhập họ và tên người nhận";
        if (!formData.receiverPhone.trim()) {
            newErrors.receiverPhone = "Vui lòng nhập số điện thoại";
        } else if (!/^\d{10}$/.test(formData.receiverPhone.trim())) {
            newErrors.receiverPhone = "Số điện thoại không hợp lệ (Phải gồm 10 chữ số)";
        }
        if (!formData.shippingAddress.trim()) newErrors.shippingAddress = "Vui lòng nhập địa chỉ cụ thể để giao hàng";

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleNextToPayment = () => {
        if (validateAddressStep()) {
            setActiveStep(2);
        }
    };

    // Hàm xử lý Đặt hàng cuối cùng
    const handlePlaceOrder = async () => {
        if (!validateAddressStep()) {
            setActiveStep(1);
            return;
        }

        try {
            const res = await placeOrder(formData);
            fetchCartCount();
            navigate('/thank-you');
        } catch (err) {
            alert("Lỗi: " + (err.response?.data || "Không thể đặt hàng"));
        }
    };

    // Kiểm tra người dùng có đồng ý các điều khoản trước khi đặt hàng
    const [isAgreed, setIsAgreed] = useState(false);

    if (isLoading) {
        return <div className="checkout-loading">Đang tải thông tin đơn hàng...</div>;
    }

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
                    <a href="/cart" className="nav-item">
                        <div className="cart-container">
                            <svg width="36" height="36" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"></path>
                            </svg>
                        </div>
                        <span className="cart-text">Cart</span>
                    </a>

                </div>

            </header>

            <main className="checkout-main-content">
                {/* CỘT TRÁI: CÁC BƯỚC THANH TOÁN */}
                <div className="checkout-steps-column">

                    {/* ĐỊA CHỈ GIAO HÀNG */}
                    <div className={`checkout-step ${activeStep === 1 ? 'active' : ''}`}>
                        <div className="step-header" onClick={() => setActiveStep(1)}>
                            <div className="step-title-wrapper">
                                <span className={`step-number-badge ${activeStep > 1 ? 'completed' : ''}`}>
                                    {activeStep > 1 ? "✓" : "1"}
                                </span>
                                <div className="step-title-content">
                                    <h3>Địa chỉ giao hàng (Shipping address)</h3>
                                    {/* HIỂN THỊ TÓM TẮT KHI THẺ ĐÓNG */}
                                    {activeStep !== 1 && formData.receiverName && (
                                        <p className="step-summary-text">
                                            <strong>{formData.receiverName}</strong> ({formData.receiverPhone})<br />
                                            {formData.shippingAddress}
                                        </p>
                                    )}
                                </div>
                            </div>
                            {activeStep !== 1 && <button className="change-btn">Thay đổi</button>}
                        </div>
                        {activeStep === 1 && (
                            <div className="step-body fade-in">
                                <form className="address-form">
                                    <div className={`form-group ${errors.receiverName ? 'has-error' : ''}`}>
                                        <label>Họ và tên</label>
                                        <input
                                            name="receiverName"
                                            value={formData.receiverName}
                                            onChange={handleChange}
                                            type="text"
                                            placeholder="Nhập họ và tên..."
                                        />
                                        {errors.receiverName && <span className="error-message">*{errors.receiverName}</span>}
                                    </div>
                                    <div className={`form-group ${errors.receiverPhone ? 'has-error' : ''}`}>
                                        <label>Số điện thoại</label>
                                        <input
                                            name="receiverPhone"
                                            value={formData.receiverPhone}
                                            onChange={handleChange}
                                            type="tel"
                                            placeholder="Nhập số điện thoại..."
                                        />
                                        {errors.receiverPhone && <span className="error-message">*{errors.receiverPhone}</span>}
                                    </div>
                                    <div className={`form-group ${errors.shippingAddress ? 'has-error' : ''}`}>
                                        <label>Địa chỉ cụ thể</label>
                                        <textarea
                                            name="shippingAddress"
                                            value={formData.shippingAddress}
                                            onChange={handleChange}
                                            type="text"
                                            placeholder="Số nhà, tên đường, tòa nhà, phường/xã..."
                                            rows="3"
                                        ></textarea>
                                        {errors.shippingAddress && <span className="error-message">*{errors.shippingAddress}</span>}
                                    </div>
                                    <button
                                        type="button"
                                        className="use-address-btn"
                                        onClick={handleNextToPayment}
                                    >
                                        Dùng địa chỉ này
                                    </button>
                                </form>
                            </div>
                        )}
                    </div>

                    {/* PHƯƠNG THỨC THANH TOÁN */}
                    <div className={`checkout-step ${activeStep === 2 ? 'active' : ''}`}>
                        <div className="step-header" onClick={() => validateAddressStep() && setActiveStep(2)}>
                            <div className="step-title-wrapper">
                                <span className={`step-number-badge ${activeStep > 2 ? 'completed' : ''}`}>
                                    {activeStep > 2 ? "✓" : "2"}
                                </span>
                                <div className="step-title-content">
                                    <h3>Phương thức thanh toán (Payment method)</h3>
                                    {/* HIỂN THỊ TÓM TẮT KHI THẺ ĐÓNG */}
                                    {activeStep !== 2 && activeStep > 2 && (
                                        <p className="step-summary-text">
                                            {formData.paymentMethod === 'COD' && "Thanh toán khi nhận hàng (COD)"}
                                            {formData.paymentMethod === 'CARD' && "Thẻ tín dụng / Thẻ ghi nợ"}
                                            {formData.paymentMethod === 'E-WALLET' && "Ví điện tử"}
                                        </p>
                                    )}
                                </div>
                            </div>
                            {activeStep !== 2 && activeStep > 2 && <button className="change-btn">Thay đổi</button>}
                        </div>
                        {activeStep === 2 && (
                            <div className="step-body fade-in">
                                <div className="payment-options">
                                    <div
                                        className={`payment-method-card ${formData.paymentMethod === 'COD' ? 'selected' : ''}`}
                                        onClick={() => handlePaymentChange('COD')}
                                    >
                                        <div className="card-radio-wrapper">
                                            <input type="radio" checked={formData.paymentMethod === 'COD'} readOnly />
                                            <div className="payment-details">
                                                <strong>Thanh toán khi nhận hàng (COD)</strong>
                                                <p>Thanh toán bằng tiền mặt khi shipper giao giày đến nơi.</p>
                                            </div>
                                        </div>
                                    </div>

                                    <div
                                        className={`payment-method-card ${formData.paymentMethod === 'CARD' ? 'selected' : ''}`}
                                        onClick={() => handlePaymentChange('CARD')}
                                    >
                                        <div className="card-radio-wrapper">
                                            <input type="radio" checked={formData.paymentMethod === 'CARD'} readOnly />
                                            <div className="payment-details">
                                                <strong>Thẻ tín dụng / Thẻ ghi nợ</strong>
                                                <p>Hỗ trợ Visa, Mastercard, JCB qua cổng thanh toán bảo mật.</p>
                                            </div>
                                        </div>
                                    </div>

                                    <div
                                        className={`payment-method-card ${formData.paymentMethod === 'E-WALLET' ? 'selected' : ''}`}
                                        onClick={() => handlePaymentChange('E-WALLET')}
                                    >
                                        <div className="card-radio-wrapper">
                                            <input type="radio" checked={formData.paymentMethod === 'E-WALLET'} readOnly />
                                            <div className="payment-details">
                                                <strong>Ví điện tử</strong>
                                                <p>Thanh toán quét mã siêu tốc qua Momo hoặc ZaloPay.</p>
                                            </div>
                                        </div>
                                    </div>
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
                        <div className="step-header" onClick={() => validateAddressStep() && setActiveStep(3)}>
                            <div className="step-title-wrapper">
                                <span className="step-number-badge">3</span>
                                <h3>Kiểm tra sản phẩm và vận chuyển (Review items)</h3>
                            </div>
                        </div>
                        {activeStep === 3 && (
                            <div className="step-body">
                                <div className="review-items-list">
                                    {cartData?.items.map((item, index) => (
                                        <div className="review-item" key={index}>
                                            <div className="product-image-wrapper">
                                                <img src={item.images[0]?.imageUrl} alt={item.productName} />
                                            </div>
                                            <div className="review-item-info">
                                                <h4>{item.productName}</h4>
                                                <p className="product-meta">Size: <span>{item.sizeValue}</span> | Màu: <span>{item.color}</span></p>
                                                <p className="product-quantity">Số lượng: {item.quantity}</p>
                                                <span className="product-item-price">
                                                    {(item.price * item.quantity).toLocaleString('vi-VN')}₫
                                                </span>
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
                        <h3>Order Summary</h3>

                        <div className="summary-billing-details">
                            <div className="billing-row">
                                <span>Tạm tính ({cartData?.items.length || 0} sản phẩm)</span>
                                <span>{cartData?.totalPrice.toLocaleString('vi-VN')}₫</span>
                            </div>
                            <div className="billing-row">
                                <span>Phí vận chuyển</span>
                                <span>30.000₫</span>
                            </div>
                            <div className="billing-row discount">
                                <span>Khuyến mãi</span>
                                <span>-30.000₫</span>
                            </div>

                            <div className="billing-divider"></div>

                            <div className="billing-row total-price-row">
                                <span className="price-text">Tổng cộng (Order total):</span>
                                <span className="price-tag">
                                    {(cartData?.totalPrice || 0).toLocaleString('vi-VN')}₫
                                </span>
                            </div>
                        </div>

                        {/* Ô tích xác nhận */}
                        <div className="agreement-checkbox-container">
                            <input
                                type="checkbox"
                                id="agree-terms"
                                checked={isAgreed}
                                onChange={(e) => setIsAgreed(e.target.checked)}
                            />
                            <label htmlFor="agree-terms">
                                Bằng việc đặt hàng, bạn đồng ý với các <a href="/terms">Điều khoản sử dụng</a> và <a href="/terms">Chính sách bảo mật</a> của chúng tôi.
                            </label>
                        </div>

                        {/* Nút đặt hàng */}
                        <button
                            className={`place-order-btn ${!isAgreed ? 'btn-disabled' : ''}`}
                            onClick={handlePlaceOrder}
                            disabled={!isAgreed} // Chỉ cho phép ấn khi isAgreed === true
                        >
                            Đặt hàng (Place your order)
                        </button>
                    </div>
                </div>
            </main>
        </div>
    );
}

export default Checkout;