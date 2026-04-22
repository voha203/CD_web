import React, { useState } from 'react';
import './Checkout.css';

function Checkout() {
    const [activeStep, setActiveStep] = useState(1);
    const [isSecurePopupOpen, setIsSecurePopupOpen] = useState(false);

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
                                        <input type="text" placeholder="Nhập họ và tên..." />
                                    </div>
                                    <div className="form-group">
                                        <label>Số điện thoại</label>
                                        <input type="tel" placeholder="Nhập số điện thoại..." />
                                    </div>
                                    <div className="form-group">
                                        <label>Địa chỉ cụ thể</label>
                                        <textarea placeholder="Số nhà, tên đường, phường/xã..."></textarea>
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
                                        <input type="radio" name="payment" defaultChecked />
                                        Thanh toán khi nhận hàng (COD)
                                    </label>
                                    <label className="radio-label">
                                        <input type="radio" name="payment" />
                                        Thẻ tín dụng / Ghi nợ (Credit / Debit Card)
                                    </label>
                                    <label className="radio-label">
                                        <input type="radio" name="payment" />
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
                                    <div className="review-item">
                                        <img src="https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=100" alt="Nike" />
                                        <div className="review-item-info">
                                            <h4>Nike Air Max 270</h4>
                                            <p>Số lượng: 1</p>
                                            <strong className="text-red">3.500.000₫</strong>
                                        </div>
                                    </div>
                                    {/* Thêm các sản phẩm khác ở đây */}
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* CỘT PHẢI: TỔNG KẾT ĐƠN HÀNG (ORDER SUMMARY) */}
                <div className="checkout-summary-column">
                    <div className="summary-box">
                        <button className="place-order-btn">Đặt hàng (Place your order)</button>
                        <p className="agreement-text">Bằng việc đặt hàng, bạn đồng ý với các Điều khoản sử dụng và Chính sách bảo mật của chúng tôi.</p>

                        <div className="summary-divider"></div>

                        <h3>Order Summary</h3>
                        <div className="summary-row">
                            <span>Tạm tính (Items):</span>
                            <span>3.500.000₫</span>
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
                            <span>3.500.000₫</span>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}

export default Checkout;