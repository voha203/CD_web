import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useCheckoutForm } from '../../components/hooks/useCheckoutForm';
import './Checkout.css';

import { placeOrder } from "../../services/orderService";
import { useCart } from "../../context/CartContext";
import { createPaymentUrl } from "../../services/paymentService"

import { FiMapPin, FiLoader } from "react-icons/fi";
import MapPicker from '../../components/layout/mapPicker/MapPicker';

function Checkout() {
    const {
        formData, setFormData, isLoading, errors, setErrors,
        mapPosition, setMapPosition, suggestions, setSuggestions,
        showSuggestions, setShowSuggestions, cartData,
        handleChange, validateAddressStep
    } = useCheckoutForm();

    const [activeStep, setActiveStep] = useState(1);
    const [isSecurePopupOpen, setIsSecurePopupOpen] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);    // State chống click spam khi đặt hàng

    // State quản lý mảng các thông báo lỗi
    const [toasts, setToasts] = useState([]);

    // State lưu vị trí ghim trên Bản đồ
    const [isSearchingLocation, setIsSearchingLocation] = useState(false);

    // Kiểm tra người dùng có đồng ý các điều khoản trước khi đặt hàng
    const [isAgreed, setIsAgreed] = useState(false);

    // Đồng bộ map ban đầu (tránh gọi API liên tục)
    const hasSyncedInitialMap = useRef(false);

    const navigate = useNavigate();
    const { fetchCartCount } = useCart();

    // Đồng bộ map với địa chỉ ban đầu
    useEffect(() => {
        // Nếu đã load xong, có địa chỉ giao hàng và chưa từng đồng bộ map
        if (!isLoading && formData.shippingAddress && !hasSyncedInitialMap.current) {
            hasSyncedInitialMap.current = true; // Đánh dấu là đã xử lý

            fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(formData.shippingAddress)}&countrycodes=vn&limit=1&accept-language=vi`)
                .then(res => res.json())
                .then(data => {
                    if (data && Array.isArray(data) && data.length > 0) {
                        const lat = parseFloat(data[0].lat);
                        const lon = parseFloat(data[0].lon);
                        setMapPosition([lat, lon]);
                    }
                })
                .catch(err => console.error("Lỗi đồng bộ tọa độ bản đồ ban đầu:", err));
        }
    }, [isLoading, formData.shippingAddress, setMapPosition]);

    // Gợi ý địa chỉ (Autocomplete)
    useEffect(() => {
        let active = true;
        const delayDebounceFn = setTimeout(() => {
            if (formData.shippingAddress && formData.shippingAddress.length > 4 && showSuggestions) {
                fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(formData.shippingAddress)}&countrycodes=vn&limit=5&accept-language=vi`)
                    .then(res => res.json())
                    .then(data => {
                        if (active) setSuggestions(data);
                    })
                    .catch(err => console.error("Lỗi tìm địa chỉ:", err));
            } else {
                setSuggestions([]);
            }
        }, 800);

        return () => {
            active = false;
            clearTimeout(delayDebounceFn);
        }
    }, [formData.shippingAddress, showSuggestions, setSuggestions]);

    const handleSelectSuggestion = (suggestion) => {
        const lat = parseFloat(suggestion.lat);
        const lon = parseFloat(suggestion.lon);

        setShowSuggestions(false);  // Ngừng hiển thị gợi ý
        setSuggestions([]);

        setFormData(prev => ({ ...prev, shippingAddress: suggestion.display_name }));
        setMapPosition([lat, lon]);
    };

    // Lấy ra vị trí hiện tại của người dùng dựa trên dữ liệu "Address" trong cơ sở dữ liệu
    const handleAutoLocate = () => {
        if (!("geolocation" in navigator)) return showError("Trình duyệt không hỗ trợ.");

        setIsSearchingLocation(true);

        navigator.geolocation.getCurrentPosition(
            async (position) => {
                const { latitude: lat, longitude: lng } = position.coords;
                setMapPosition([lat, lng]);

                try {
                    // Thêm một khoảng trễ nhỏ để tránh spam API liên tục
                    const response = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&accept-language=vi`);
                    const data = await response.json();
                    if (data?.display_name) {
                        setFormData(prev => ({ ...prev, shippingAddress: data.display_name }));
                    }
                } catch (error) {
                    console.error("Lỗi lấy địa chỉ:", error);
                } finally {
                    setIsSearchingLocation(false);
                }
            },
            (error) => {
                showError("Vui lòng cấp quyền định vị.");
                setIsSearchingLocation(false);
            }
        );
    };

    // Hàm xử lý chọn phương thức thanh toán
    const handlePaymentChange = (value) => {
        setFormData(prev => ({
            ...prev,
            paymentMethod: value
        }));
    };

    const handleNextToPayment = () => {
        if (validateAddressStep()) {
            setActiveStep(2);
        }
    };

    // Hàm xử lý Đặt hàng cuối cùng
    const handlePlaceOrder = async () => {
        // KIỂM TRA BƯỚC 1: Địa chỉ giao hàng
        if (!validateAddressStep()) {
            showError("Vui lòng hoàn thành chính xác thông tin địa chỉ giao hàng tại Bước 1.");
            setActiveStep(1); // Tự động mở lại Bước 1 cho khách sửa
            return;
        }

        // KIỂM TRA BƯỚC 2: Phương thức thanh toán
        if (!formData.paymentMethod) {
            showError("Vui lòng chọn một phương thức thanh toán tại Bước 2.");
            setActiveStep(2); // Tự động mở Bước 2 nếu chưa chọn
            return;
        }

        // KIỂM TRA BƯỚC 3: Ép người dùng phải ở Bước 3 để rà soát lại đơn hàng
        if (activeStep !== 3) {
            showError("Vui lòng kiểm tra lại danh sách sản phẩm và bấm xác nhận ở Bước 3 trước.");
            setActiveStep(3); // Tự động đưa họ đến Bước 3 để review
            return;
        }

        setIsSubmitting(true);
        try {
            const res = await placeOrder(formData);
            fetchCartCount();

            const orderId = res.data.orderId;

            if (formData.paymentMethod === 'CARD' || formData.paymentMethod === 'E-WALLET') {
                const bankCode = formData.paymentMethod === 'CARD' ? 'NCB' : 'VNPAYQR';
                const paymentRes = await createPaymentUrl(orderId, bankCode);
                const paymentUrl = paymentRes.data?.paymentUrl || paymentRes.paymentUrl;

                if (paymentUrl) {
                    // Đưa khách hàng sang cổng VNPay
                    window.location.href = paymentUrl;
                } else {
                    showError("Lỗi: Không thể khởi tạo link thanh toán VNPay!");
                    setIsSubmitting(false); // Mở khóa nút bấm nếu lỗi
                }
            } else {
                // Phương thức thanh toán: COD
                navigate(`/thank-you?orderId=${orderId}`);
            }
        } catch (err) {
            const errorMsg = err.response?.data?.message || err.response?.data || err.message || "Không thể đặt hàng";
            showError("Lỗi: " + errorMsg);
        } finally {
            setIsSubmitting(false);
        }
    };

    function showError(message) {
        const id = Date.now(); // Tạo ID duy nhất cho mỗi item lỗi

        // Thêm lỗi mới vào mảng toasts
        setToasts(prevToasts => [...prevToasts, { id, message }]);

        // Tự động xóa lỗi này sau 3 giây
        setTimeout(() => {
            setToasts(prevToasts => prevToasts.filter(toast => toast.id !== id));
        }, 3000);
    }

    if (isLoading) {
        return <div className="checkout-loading">Đang tải thông tin đơn hàng...</div>;
    }

    return (
        <div className="checkout-page-container">
            <div id="toast-container">
                {toasts.map(toast => (
                    <div key={toast.id} className="toast-error">
                        {toast.message}
                    </div>
                ))}
            </div>
            <header className="header">

                {/* NavBar trên */}
                <div className="nav-main">

                    {/* Cụm logo */}
                    <Link to="/" className="nav-item">
                        <span className="logo-text">mysneaker</span>
                    </Link>

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
                    <Link to="/cart" className="nav-item">
                        <div className="cart-container">
                            <svg width="36" height="36" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"></path>
                            </svg>
                        </div>
                        <span className="cart-text">Cart</span>
                    </Link>

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
                            {activeStep !== 1 && (
                                <button
                                    className="change-btn"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        setActiveStep(1);
                                    }}
                                >
                                    Thay đổi
                                </button>
                            )}
                        </div>
                        {activeStep === 1 && (
                            <div className="step-body fade-in">
                                <form className="address-form">
                                    <div className="form-row">
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
                                    </div>

                                    {/* KHU VỰC NHẬP ĐỊA CHỈ & BẢN ĐỒ */}
                                    <div className={`form-group ${errors.shippingAddress ? 'has-error' : ''}`} style={{ position: 'relative' }}>
                                        <label>Địa chỉ cụ thể</label>

                                        <div style={{ width: '700px', display: 'flex', gap: '8px' }}>
                                            <input
                                                name="shippingAddress"
                                                value={formData.shippingAddress}
                                                onChange={handleChange}
                                                type="text"
                                                placeholder="Gõ để tìm kiếm (Số nhà, tên đường, phường/xã)..."
                                                style={{ flex: 1 }}
                                                autoComplete="off"
                                            />
                                            <button
                                                type="button"
                                                className="locate-btn"
                                                onClick={handleAutoLocate}
                                                disabled={isSearchingLocation}
                                            >
                                                {isSearchingLocation ? (
                                                    <>
                                                        <FiLoader className="spinner-icon" />
                                                        <span>Đang xác định...</span>
                                                    </>
                                                ) : (
                                                    <>
                                                        <FiMapPin />
                                                        <span>Vị trí hiện tại</span>
                                                    </>
                                                )}
                                            </button>
                                        </div>

                                        {/* Dropdown Gợi ý địa chỉ */}
                                        {suggestions.length > 0 && showSuggestions && (
                                            <ul className="suggestions-dropdown">
                                                {suggestions.map((sug, idx) => (
                                                    <li
                                                        key={idx}
                                                        onClick={() => handleSelectSuggestion(sug)}
                                                        style={{ padding: '10px', borderBottom: '1px solid #eee', cursor: 'pointer', fontSize: '14px' }}
                                                    >
                                                        {sug.display_name}
                                                    </li>
                                                ))}
                                            </ul>
                                        )}

                                        {errors.shippingAddress && <span className="error-message">*{errors.shippingAddress}</span>}

                                        {/* Bản đồ tích hợp */}
                                        <MapPicker
                                            mapPosition={mapPosition}
                                            setMapPosition={setMapPosition}
                                            setFormData={setFormData}
                                            setShowSuggestions={setShowSuggestions}
                                        />
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
                        <div className="step-header" onClick={() => validateAddressStep() ? setActiveStep(2) : showError("Vui lòng điền đủ thông tin Bước 1")}>
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
                            {activeStep !== 2 && activeStep > 2 && (
                                <button
                                    className="change-btn"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        setActiveStep(2);
                                    }}
                                >
                                    Thay đổi
                                </button>
                            )}
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
                                    onClick={() => {
                                        if (formData.paymentMethod) {
                                            setActiveStep(3);
                                        } else {
                                            showError("Bạn chưa chọn phương thức thanh toán nào cả!");
                                        }
                                    }}
                                >
                                    Dùng phương thức này
                                </button>
                            </div>
                        )}
                    </div>

                    {/* KIỂM TRA ĐƠN HÀNG */}
                    <div className={`checkout-step ${activeStep === 3 ? 'active' : ''}`}>
                        <div className="step-header" onClick={() => {
                            if (validateAddressStep() && formData.paymentMethod) {
                                setActiveStep(3);
                            } else if (!validateAddressStep()) {
                                showError("Vui lòng hoàn thành Bước 1 trước.");
                                setActiveStep(1);
                            } else {
                                showError("Vui lòng chọn phương thức thanh toán ở Bước 2.");
                                setActiveStep(2);
                            }
                        }}>
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
                            className={`place-order-btn ${(!isAgreed || isSubmitting) ? 'btn-disabled' : ''}`}
                            onClick={handlePlaceOrder}
                            disabled={!isAgreed || isSubmitting} // Chỉ cho phép ấn khi isAgreed === true
                        >
                            {isSubmitting ? 'Đang xử lý...' : 'Đặt hàng (Place your order)'}
                        </button>
                    </div>
                </div>
            </main>
        </div>
    );
}

export default Checkout;
