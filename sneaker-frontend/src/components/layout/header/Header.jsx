import React, { useState, useEffect, useRef } from 'react';
import './Header.css';
import { useNavigate, useSearchParams, useLocation } from 'react-router-dom';

import logo_flag_vn from '../../../assets/images/flag/vn.svg'
import logo_flag_en from '../../../assets/images/flag/en.svg'

import { getCurrentUser, isAuthenticated, logout } from "../../utils/auth";
import { useCart } from "../../../context/CartContext"
import { getProductSuggestions } from '../../../services/api';

const normalizeRole = (role) => {
    if (!role) return "";
    return role.toUpperCase().replace("ROLE_", "");
};

function Header() {
    const navigate = useNavigate();
    const location = useLocation();
    // Thêm hook để đọc tham số từ URL
    const [searchParams] = useSearchParams();

    const [selectedCategory, setSelectedCategory] = useState("All");
    // State quản lý ô nhập liệu tìm kiếm
    const [keyword, setKeyword] = useState("");
    // State cho tính năng gợi ý
    const [suggestions, setSuggestions] = useState([]);
    const [showDropdown, setShowDropdown] = useState(false);
    const isSearching = useRef(false);
    // Xác định vùng thanh tìm kiếm, phục vụ tính năng "click ra ngoài để ẩn hộp gợi ý"
    const searchRef = useRef(null);

    const [language, setLanguage] = useState("VN");
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    const [authUser, setAuthUser] = useState(() => getCurrentUser());
    const [isAccountMenuOpen, setIsAccountMenuOpen] = useState(false);
    const accountRef = useRef(null);

    const { cartCount, fetchCartCount } = useCart();

    // Đồng bộ URL vào state khi Component được load
    useEffect(() => {
        const urlCategory = searchParams.get("category");
        const urlKeyword = searchParams.get("keyword");

        if (urlCategory) setSelectedCategory(urlCategory);
        if (urlKeyword) {
            isSearching.current = true;
            setKeyword(urlKeyword);
        }
    }, [searchParams]);

    useEffect(() => {
        // Nếu ô tìm kiếm trống, xóa danh sách gợi ý và ẩn dropdown
        if (!keyword.trim() || isSearching.current) {
            setSuggestions([]);
            setShowDropdown(false);
            return;
        }

        // Tạo một bộ đếm lùi 300ms
        const delayDebounceFn = setTimeout(async () => {
            const data = await getProductSuggestions(keyword);
            if (!isSearching.current) {
                setSuggestions(data);
                setShowDropdown(data.length > 0);
            }
        }, 300);

        return () => clearTimeout(delayDebounceFn);
    }, [keyword]);

    // Click ra ngoài để ẩn dropdown
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (searchRef.current && !searchRef.current.contains(event.target)) {
                setShowDropdown(false);
            }

            if (accountRef.current && !accountRef.current.contains(event.target)) {
                setIsAccountMenuOpen(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    // Tự động đóng dropdown khi URL thay đổi (chuyển trang)
    useEffect(() => {
        setShowDropdown(false);
        setSuggestions([]);
        setIsAccountMenuOpen(false);
        setIsMobileMenuOpen(false);
    }, [location]);

    useEffect(() => {
        const syncAuth = () => {
            const user = getCurrentUser();
            setAuthUser(user);

            if (user && normalizeRole(user.role) === "USER") {
                fetchCartCount();
            }
        };

        syncAuth();
        window.addEventListener("auth-changed", syncAuth);
        return () => window.removeEventListener("auth-changed", syncAuth);
    }, [location]);

    const handleCartClick = () => {
        if (isAuthenticated()) {
            navigate("/cart");
        } else {
            navigate("/login");
        }
    };

    const handleOrdersClick = () => {
        if (isAuthenticated()) {
            navigate("/orders");
        } else {
            navigate("/login");
        }
    };

    const handleWishlistClick = (event) => {
        if (event) event.stopPropagation();
        if (isAuthenticated()) {
            navigate("/wishlist");
        } else {
            navigate("/login");
        }
    };

    const handleAccountClick = () => {
        if (!isAuthenticated()) {
            navigate("/login");
            return;
        }

        setIsAccountMenuOpen(prev => !prev);
    };

    const handleLogout = (event) => {
        event.stopPropagation();
        logout();
        navigate("/");
    };

    const handleProfileClick = (event) => {
        event.stopPropagation();
        setIsAccountMenuOpen(false);
        navigate("/profile");
    };

    const handleAccountOrdersClick = (event) => {
        event.stopPropagation();
        setIsAccountMenuOpen(false);
        navigate("/orders");
    };

    const handleChangePassword = (event) => {
        event.stopPropagation();
        setIsAccountMenuOpen(false);
        navigate("/profile", { state: { tab: "security" } });
    };

    // Hàm thực hiện tìm kiếm chính
    const performSearch = (searchWord, categoryWord) => {
        const params = new URLSearchParams();
        if (searchWord.trim()) {
            params.append("keyword", searchWord.trim());
        }
        if (categoryWord && categoryWord !== "All") {
            params.append("category", categoryWord);
        }

        isSearching.current = true;
        setShowDropdown(false);
        setSuggestions([]);

        navigate(`/products?${params.toString()}`);
    };

    // Xử lý khi click vào một sản phẩm trong danh sách gợi ý
    const handleSuggestionClick = (productName) => {
        isSearching.current = true;
        setKeyword(productName);
        setShowDropdown(false);
        setSuggestions([]);
        performSearch(productName, selectedCategory);
    };

    // Hàm xử lý logic khi submit tìm kiếm
    const handleSearch = (e) => {
        e.preventDefault(); // Ngăn chặn trang bị reload mặc định của form
        isSearching.current = true;
        performSearch(keyword, selectedCategory);
    };

    return (
        <header className="header">

            {/* NavBar trên */}
            <div className="nav-main">

                {/* Cụm logo */}
                <a href="/" className="nav-item">
                    <span className="logo-text">Mysneaker</span>
                </a>

                {/* Vị trí giao hàng */}
                <div className="nav-item hide-on-mobile">
                    <svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ marginBottom: '4px', marginRight: '4px' }}>
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path>
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path>
                    </svg>
                    <div className="flex-col-text">
                        <span className="nav-text-small">Deliver to</span>
                        <span className="nav-text-bold">Vietnam</span>
                    </div>
                </div>

                {/* Thanh tìm kiếm */}
                <form className="search-container" ref={searchRef} onSubmit={handleSearch}>
                    <div className="search-select-wrapper">
                        <span className="search-select-text">
                            {selectedCategory}
                            <svg width="12" height="12" fill="currentColor" viewBox="0 0 24 24" style={{ marginLeft: '4px', marginTop: '2px' }}>
                                <path d="M7 10l5 5 5-5z"></path>
                            </svg>
                        </span>
                        <select
                            className="search-select-hidden"
                            value={selectedCategory}
                            onChange={(e) => setSelectedCategory(e.target.value)}
                        >
                            <option value="All">All</option>
                            <option value="Sneakers">Sneakers</option>
                            <option value="Apparel">Apparel</option>
                            <option value="Accessories">Accessories</option>
                            <option value="All Departments">All Departments</option>
                        </select>
                    </div>

                    <input
                        type="text"
                        placeholder="Search mysneaker"
                        className="search-input"
                        value={keyword}
                        onChange={(e) => { isSearching.current = false; setKeyword(e.target.value);}}
                        onFocus={() => { if (suggestions.length > 0) setShowDropdown(true); }}
                    />

                    {/* Hộp gợi ý tìm kiếm (Suggestions Dropdown) */}
                    {showDropdown && (
                        <div className="search-suggestions-dropdown">
                            {suggestions.map((product) => (
                                <div
                                    key={product.id}
                                    className="suggestion-item"
                                    onClick={() => handleSuggestionClick(product.name)}
                                >
                                    <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ marginRight: '10px', color: '#565959' }}>
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
                                    </svg>
                                    <span className="suggestion-name">{product.name}</span>
                                </div>
                            ))}
                        </div>
                    )}

                    <button type="submit" className="search-btn">
                        <svg width="24" height="24" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
                        </svg>
                    </button>
                </form>

                {/* Chọn ngôn ngữ (Language Switcher) */}
                <div className="nav-item language-select-wrapper hide-on-mobile">
                    <div className="language-trigger">
                        <img src={language === 'VN' ? logo_flag_vn : logo_flag_en} alt="flag" className="header-flag" />
                        <span className="header-lang-text">{language}</span>
                        <svg width="10" height="10" fill="currentColor" viewBox="0 0 24 24" style={{ marginLeft: '4px', marginTop: '4px', color: '#ccc' }}>
                            <path d="M7 10l5 5 5-5z"></path>
                        </svg>
                    </div>

                    <div className="language-dropdown-menu">
                        <div className="dropdown-arrow-up"></div>

                        <div className="dropdown-inner">
                            <div className="dropdown-title">Change language</div>

                            <label className="dropdown-radio-label">
                                <input
                                    type="radio"
                                    name="lang-select"
                                    className="custom-radio"
                                    checked={language === 'EN'}
                                    onChange={() => setLanguage('EN')}
                                />
                                <span>English - EN</span>
                            </label>

                            <label className="dropdown-radio-label">
                                <input
                                    type="radio"
                                    name="lang-select"
                                    className="custom-radio"
                                    checked={language === 'VN'}
                                    onChange={() => setLanguage('VN')}
                                />
                                <span>Tiếng Việt - VN</span>
                            </label>

                            <div className="dropdown-divider"></div>

                            <div className="dropdown-title">Change currency</div>

                            <label className="dropdown-radio-label">
                                <input type="radio" name="currency-select" className="custom-radio" defaultChecked />
                                <span>$ - USD - US Dollar</span>
                            </label>

                            <label className="dropdown-radio-label">
                                <input type="radio" name="currency-select" className="custom-radio" />
                                <span>₫ - VND - Vietnamese Dong</span>
                            </label>
                        </div>
                    </div>
                </div>

                {/* Account và Orders */}
                <div className="nav-item account-nav-item" ref={accountRef} onClick={handleAccountClick}>
                    <div className="flex-col-text">
                        <span className="nav-text-small">
                            {authUser ? `Hello, ${authUser.fullName || authUser.username}` : "Hello, sign in"}
                        </span>
                        <span className="nav-text-bold">{authUser ? "Account" : "Account & Lists"}</span>
                    </div>
                    <svg className="account-caret" width="12" height="12" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M7 10l5 5 5-5z"></path>
                    </svg>
                    {authUser && isAccountMenuOpen && (
                        <div className="account-dropdown-menu">
                            <button type="button" onClick={handleProfileClick}>Hồ sơ của tôi</button>
                            <button type="button" onClick={handleAccountOrdersClick}>Đơn hàng của tôi</button>
                            <button type="button" onClick={handleChangePassword}>Đổi mật khẩu</button>
                            <button type="button" onClick={handleWishlistClick}>Sản phẩm yêu thích</button>
                            <div className="account-dropdown-divider"></div>
                            <button type="button" className="danger" onClick={handleLogout}>Đăng xuất</button>
                        </div>
                    )}
                </div>

                <div className="nav-item hide-on-mobile" onClick={handleOrdersClick}>
                    <div className="flex-col-text">
                        <span className="nav-text-small">Returns</span>
                        <span className="nav-text-bold">& Orders</span>
                    </div>
                </div>

                <div className="nav-item hide-on-mobile" onClick={handleWishlistClick}>
                    <div className="flex-col-text">
                        <span className="nav-text-small">Your</span>
                        <span className="nav-text-bold">Wishlist</span>
                    </div>
                </div>

                {/* Giỏ hàng */}
                <div className="nav-item" onClick={handleCartClick} style={{ cursor: "pointer" }}>
                    <div className="cart-container">
                        <svg width="36" height="36" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"></path>
                        </svg>
                        <span className="cart-count">{cartCount}</span>
                    </div>
                    <span className="cart-text">Cart</span>
                </div>

            </div>

            {/* NavBar dưới */}
            <div className="nav-sub">
                <button
                    className={`nav-item mobile-menu-toggle ${isMobileMenuOpen ? 'active' : ''}`}
                    type="button"
                    aria-label="Mở menu danh mục"
                    aria-expanded={isMobileMenuOpen}
                    onClick={() => setIsMobileMenuOpen(prev => !prev)}
                    style={{ fontWeight: 'bold', marginRight: '8px' }}
                >
                    <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ marginRight: '4px' }}>
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M4 6h16M4 12h16M4 18h16"></path>
                    </svg>
                    All
                </button>

                <div className={`nav-sub-links ${isMobileMenuOpen ? 'open' : ''}`}>
                    <a href="/products" className="nav-item">Sản phẩm</a>
                    <a href="/products?sort=sale" className="nav-item">Khuyến mãi</a>
                    <a href="/orders" className="nav-item">Đơn hàng</a>
                    <a href="/profile" className="nav-item">Tài khoản</a>
                </div>
            </div>

        </header>
    );
}

export default Header;
