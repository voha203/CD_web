import React, { useState } from 'react';
import './Header.css';

function Header() {
    const [selectedCategory, setSelectedCategory] = useState("All");

    return (
        <header className="header">

            {/* NavBar trên */}
            <div className="nav-main">

                {/* Cụm logo */}
                <a href="/" className="nav-item">
                    <span className="logo-text">mysneaker</span>
                </a>

                {/* Vị trí giao hàng */}
                <div className="nav-item">
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
                <div className="search-container">
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

                    <input type="text" placeholder="Search mysneaker" className="search-input" />

                    <button className="search-btn">
                        <svg width="24" height="24" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
                        </svg>
                    </button>
                </div>

                {/* Account và Orders */}
                <div className="nav-item">
                    <div className="flex-col-text">
                        <span className="nav-text-small">Hello, sign in</span>
                        <span className="nav-text-bold">Account & Lists</span>
                    </div>
                </div>

                <div className="nav-item">
                    <div className="flex-col-text">
                        <span className="nav-text-small">Returns</span>
                        <span className="nav-text-bold">& Orders</span>
                    </div>
                </div>

                {/* Giỏ hàng */}
                <div className="nav-item">
                    <div className="cart-container">
                        <svg width="36" height="36" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"></path>
                        </svg>
                        <span className="cart-count">0</span>
                    </div>
                    <span className="cart-text">Cart</span>
                </div>

            </div>

            {/* NavBar dưới */}
            <div className="nav-sub">
                <button className="nav-item" style={{ fontWeight: 'bold', marginRight: '8px' }}>
                    <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ marginRight: '4px' }}>
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M4 6h16M4 12h16M4 18h16"></path>
                    </svg>
                    All
                </button>

                <div className="nav-sub-links">
                    <a href="/" className="nav-item">Today's Deals</a>
                    <a href="/" className="nav-item">Customer Service</a>
                    <a href="/" className="nav-item">Registry</a>
                    <a href="/" className="nav-item">Gift Cards</a>
                </div>
            </div>

        </header>
    );
}

export default Header;