import React, { useState, useEffect } from 'react';
import Header from "../../components/layout/header/Header";
import Footer from "../../components/layout/footer/Footer";
import './Cart.css';

function Cart() {
    // Dữ liệu ảo (Mock data) của giỏ hàng
    const [cartItems, setCartItems] = useState([
        { id: 1, brand: 'Nike', name: 'Air Max 270', price: 3500000, quantity: 1, imageUrl: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400' },
        { id: 2, brand: 'Adidas', name: 'Ultraboost 22', price: 4200000, quantity: 2, imageUrl: 'https://images.unsplash.com/photo-1608231387042-66d1773070a5?w=400' }
    ]);

    // Tính tổng tiền
    const subtotal = cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);

    const handleIncrease = (id) => {
        setCartItems(cartItems.map(item => item.id === id ? { ...item, quantity: item.quantity + 1 } : item));
    };

    const handleDecrease = (id) => {
        setCartItems(cartItems.map(item => item.id === id && item.quantity > 1 ? { ...item, quantity: item.quantity - 1 } : item));
    };

    const handleInputChange = (id, value) => {
        const newQuantity = parseInt(value);
        if (!isNaN(newQuantity) && newQuantity >= 1) {
            setCartItems(cartItems.map(item => item.id === id ? { ...item, quantity: newQuantity } : item));
        } else if (value === '') {
            setCartItems(cartItems.map(item => item.id === id ? { ...item, quantity: '' } : item));
        }
    };

    const handleInputBlur = (id, currentQuantity) => {
        if (currentQuantity === '' || currentQuantity < 1) {
            setCartItems(cartItems.map(item => item.id === id ? { ...item, quantity: 1 } : item));
        }
    };

    const [isLoggedIn, setIsLoggedIn] = useState(true);

    if (!isLoggedIn) {
        return (
            <div className="cart-page-container">
                <Header />
                <main className="cart-unauth-container">
                    <div className="unauth-content-box">
                        <div className="unauth-image-wrapper">
                            <img
                                src="https://m.media-amazon.com/images/G/01/cart/empty/kettle-desaturated._CB424694257_.svg"
                                alt="Empty Cart Illustration"
                            />
                        </div>
                        <div className="unauth-text-actions">
                            <h2>Giỏ hàng của bạn đang trống</h2>
                            <a href="/deals" className="shop-deals-link">Xem các ưu đãi hôm nay</a>

                            <div className="unauth-buttons-group">
                                <a href="/login">
                                    <button className="sign-in-btn">Đăng nhập vào tài khoản</button>
                                </a>
                                <a href="/register">
                                    <button className="sign-up-btn">Đăng ký ngay</button>
                                </a>
                            </div>
                        </div>
                    </div>
                </main>
                <Footer />
            </div>
        );
    }

    // Xử lí trạng thái giỏ hàng trống
    if (cartItems.length >= 0) {
        return (
            <div className="cart-page-container">
                <Header />
                <main className="cart-empty-error-state">
                    <img src="https://cdn-icons-png.flaticon.com/512/11329/11329060.png" alt="Empty Cart" className="state-image" />
                    <div class="row-header">
                        <span>Chưa có sản phẩm nào trong giỏ hàng</span>
                    </div>
                    <div class="cart-actions">
                        <button class="return-btn">
                            <span>QUAY TRỞ LẠI CỬA HÀNG</span>
                        </button>
                    </div>
                </main>
                <Footer />
            </div>
        );
    }

    return (
        <div className="cart-page-container">
            <Header />

            <main className="cart-main-content">
                {/* CỘT TRÁI: DANH SÁCH SẢN PHẨM */}
                <div className="cart-items-section">
                    <div className="cart-header-title">
                        <h2>Shopping Cart</h2>
                        <span className="price-label">Price</span>
                    </div>

                    <div className="cart-items-list">
                        {cartItems.map(item => (
                            <div key={item.id} className="cart-item">
                                <div className="cart-item-image">
                                    <img src={item.imageUrl} alt={item.name} />
                                </div>

                                <div className="cart-item-details">
                                    <h3 className="item-name">{item.name}</h3>
                                    <p className="item-brand">{item.brand}</p>
                                    <p className="item-stock">In Stock</p>

                                    <div className="item-actions">
                                        <div className="quantity-control-group">
                                            <button
                                                className="qty-btn"
                                                onClick={() => handleDecrease(item.id)}
                                                disabled={item.quantity <= 1}
                                            >
                                                -
                                            </button>
                                            <input
                                                type="number"
                                                className="qty-input"
                                                value={item.quantity}
                                                onChange={(e) => handleInputChange(item.id, e.target.value)}
                                                onBlur={() => handleInputBlur(item.id, item.quantity)}
                                                min="1"
                                            />
                                            <button
                                                className="qty-btn"
                                                onClick={() => handleIncrease(item.id)}
                                            >
                                                +
                                            </button>
                                        </div>

                                        {/* Nút bấm được làm lại rõ ràng hơn, có icon */}
                                        <div className="action-buttons-group">
                                            <button className="action-btn delete-btn">
                                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                    <polyline points="3 6 5 6 21 6"></polyline>
                                                    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                                                </svg>
                                                Xóa
                                            </button>
                                            <button className="action-btn save-later-btn">
                                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                    <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"></path>
                                                </svg>
                                                Lưu lại
                                            </button>
                                        </div>
                                    </div>
                                </div>

                                <div className="cart-item-price">
                                    <strong>{item.price.toLocaleString('vi-VN')}₫</strong>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="cart-subtotal-bottom">
                        Subtotal ({cartItems.length} items): <strong>{subtotal.toLocaleString('vi-VN')}₫</strong>
                    </div>
                </div>

                {/* CỘT PHẢI: BẢNG TÓM TẮT ĐỂ THANH TOÁN */}
                <div className="cart-checkout">
                    <div className="cart-header">
                        <span>CỘNG GIỎ HÀNG</span>
                    </div>
                    <div className="cart-checkout-information">
                        <div className="parent">
                            <div className="left">
                                <span>Tạm tính</span>
                            </div>
                            <div className="right">
                                <span className="total-price">
                                    <b>{subtotal.toLocaleString('en-US')}₫</b>
                                </span>
                            </div>
                        </div>
                        <div className="parent">
                            <div className="left">
                                <span>Tổng</span>
                            </div>
                            <div className="right">
                                <span className="total-price">
                                    <b>{subtotal.toLocaleString('en-US')}₫</b>
                                </span>
                            </div>
                        </div>
                    </div>
                    <div className="cart-checkout-actions">
                        <a href="/checkout">
                            <button className="checkout-btn">
                                <span>TIẾN HÀNH THANH TOÁN</span>
                            </button>
                        </a>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
}

export default Cart;