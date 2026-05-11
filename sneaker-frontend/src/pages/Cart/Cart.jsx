import React, { useState, useEffect } from 'react';
import Header from "../../components/layout/header/Header";
import Footer from "../../components/layout/footer/Footer";
import './Cart.css';

import {
    getCart,
    updateQuantity,
    deleteItem
} from "../../services/cartService"


function Cart() {

    const [cartData, setCartData] = useState(null);
    const [cartItems, setCartItems] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isLoggedIn, setIsLoggedIn] = useState(true);

    // Lấy dữ liệu giỏ hàng từ cơ sở dữ liệu
    const fetchCart = async () => {
        try {
            setIsLoading(true);
            const res = await getCart();
            setCartData(res.data);
            setCartItems(res.data.items || []);
        } catch (err) {
            console.error("Fetch cart error:", err);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchCart();
    }, []);

    const handleIncrease = async (id, qty) => {
        await updateQuantity(id, qty + 1);
        fetchCart();
    };

    const handleDecrease = async (id, qty) => {
        if (qty <= 1) return;
        await updateQuantity(id, qty - 1);
        fetchCart();
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Xóa sản phẩm?")) return;
        await deleteItem(id);
        fetchCart();
    };

    const handleInputBlur = async (id, value) => {
        let qty = parseInt(value);
        if (!qty || qty < 1) qty = 1;

        await updateQuantity(id, qty);
        fetchCart();
    };

    const handleInputChange = (id, value) => {
        setCartItems(prev =>
            prev.map(item =>
                item.cartItemId === id
                    ? { ...item, quantity: value }
                    : item
            )
        );
    };

    const subtotal = cartData?.totalPrice || 0;

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
    if (cartItems.length === 0) {
        return (
            <div className="cart-page-container">
                <Header />
                <main className="cart-empty-error-state">
                    <img src="https://cdn-icons-png.flaticon.com/512/11329/11329060.png" alt="Empty Cart" className="state-image" />
                    <div className="row-header">
                        <span>Chưa có sản phẩm nào trong giỏ hàng</span>
                    </div>
                    <div className="cart-actions">
                        <button className="return-btn">
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
                                    <img src={item.images[0]?.imageUrl} alt={item.productName} />
                                </div>

                                <div className="cart-item-details">
                                    <h3 className="item-name">{item.productName}</h3>
                                    <p className="item-brand">{item.brand}</p>
                                    <p className="item-stock">In Stock</p>

                                    <div className="item-actions">
                                        <div className="quantity-control-group">
                                            <button
                                                className="qty-btn"
                                                onClick={() => handleDecrease(item.id, item.quantity)}
                                                disabled={item.quantity <= 1}
                                            >
                                                -
                                            </button>
                                            <input
                                                type="number"
                                                className="qty-input"
                                                value={item.quantity}
                                                onChange={(e) => handleInputChange(item.id, e.target.value)}
                                                onBlur={(e) => handleInputBlur(item.id, e.target.value)}
                                                min="1"
                                            />
                                            <button
                                                className="qty-btn"
                                                onClick={() => handleIncrease(item.id, item.quantity)}
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
                                    <strong>{(item.price * item.quantity).toLocaleString('vi-VN')}₫</strong>
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