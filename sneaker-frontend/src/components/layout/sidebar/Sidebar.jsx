import React from 'react';
import './Sidebar.css';

function Sidebar() {
    return (
        <aside className="sidebar-wrapper">

            {/* KHỐI 1: DANH MỤC */}
            <div className="filter-section">
                <h3 className="filter-heading">Danh mục</h3>
                <ul className="category-list">
                    <li><a href="#" className="category-link">Giày Nam</a></li>
                    <li className="sub-item">
                        <a href="#" className="category-link active">Sneakers</a>
                    </li>
                    <li className="sub-item"><a href="#" className="category-link">Giày Chạy Bộ</a></li>
                    <li className="sub-item"><a href="#" className="category-link">Giày Bóng Rổ</a></li>
                    <li><a href="#" className="category-link mt-1">Giày Nữ</a></li>
                    <li><a href="#" className="category-link mt-1">Giày Trẻ Em</a></li>
                </ul>
            </div>

            {/* KHỐI 2: THƯƠNG HIỆU */}
            <div className="filter-section">
                <h3 className="filter-heading">Thương hiệu</h3>
                <div>
                    <div className="checkbox-group">
                        <input type="checkbox" id="brand-nike" />
                        <label htmlFor="brand-nike" className="checkbox-label">Nike</label>
                    </div>
                    <div className="checkbox-group">
                        <input type="checkbox" id="brand-adidas" />
                        <label htmlFor="brand-adidas" className="checkbox-label">Adidas</label>
                    </div>
                    <div className="checkbox-group">
                        <input type="checkbox" id="brand-jordan" />
                        <label htmlFor="brand-jordan" className="checkbox-label">Air Jordan</label>
                    </div>
                    <div className="checkbox-group">
                        <input type="checkbox" id="brand-converse" />
                        <label htmlFor="brand-converse" className="checkbox-label">Converse</label>
                    </div>
                    <div className="checkbox-group">
                        <input type="checkbox" id="brand-new-balance" />
                        <label htmlFor="brand-new-balance" className="checkbox-label">New Balance</label>
                    </div>
                    <div className="checkbox-group">
                        <input type="checkbox" id="brand-vans" />
                        <label htmlFor="brand-vans" className="checkbox-label">Vans</label>
                    </div>
                </div>
            </div>

            {/* KHỐI 3: GIÁ CẢ */}
            <div className="filter-section">
                <h3 className="filter-heading">Giá cả</h3>

                {/* Danh sách các khoảng giá (Dùng Radio để chọn 1) */}
                <div className="price-ranges">
                    <label className="radio-label">
                        <input type="radio" name="price-filter" value="under-1m" className="radio-input" />
                        <span className="radio-text">Dưới 1.000.000₫</span>
                    </label>
                    <label className="radio-label">
                        <input type="radio" name="price-filter" value="1m-3m" className="radio-input" />
                        <span className="radio-text">1.000.000₫ - 3.000.000₫</span>
                    </label>
                    <label className="radio-label">
                        <input type="radio" name="price-filter" value="3m-5m" className="radio-input" />
                        <span className="radio-text">3.000.000₫ - 5.000.000₫</span>
                    </label>
                    <label className="radio-label">
                        <input type="radio" name="price-filter" value="over-5m" className="radio-input" />
                        <span className="radio-text">Trên 5.000.000₫</span>
                    </label>
                </div>

                {/* Khu vực nhập giá tự do */}
                <div className="custom-price-area">
                    <div className="price-inputs-row">
                        <div className="input-wrapper">
                            <input type="number" placeholder="TỐI THIỂU" className="price-input-new" />
                            <span className="currency-badge">₫</span>
                        </div>
                        <span className="price-separator">-</span>
                        <div className="input-wrapper">
                            <input type="number" placeholder="TỐI ĐA" className="price-input-new" />
                            <span className="currency-badge">₫</span>
                        </div>
                    </div>
                    <button className="price-submit-btn">Áp dụng mức giá</button>
                </div>
            </div>

            {/* KHỐI 4: KÍCH CỠ */}
            <div className="filter-section">
                <h3 className="filter-heading">Kích cỡ</h3>
                <div className="size-grid">
                    <button className="size-btn">24</button>
                    <button className="size-btn">25</button>
                    <button className="size-btn">26</button>
                    <button className="size-btn">27</button>
                    <button className="size-btn">28</button>
                    <button className="size-btn">29</button>
                    <button className="size-btn">30</button>
                    <button className="size-btn">31</button>
                    <button className="size-btn">32</button>
                    <button className="size-btn">33</button>
                    <button className="size-btn">34</button>
                    <button className="size-btn">35</button>
                    <button className="size-btn">36</button>
                    <button className="size-btn">37</button>
                    <button className="size-btn">38</button>
                    <button className="size-btn">39</button>
                    <button className="size-btn">40</button>
                    <button className="size-btn">41</button>
                    <button className="size-btn">42</button>
                    <button className="size-btn">43</button>
                    <button className="size-btn">44</button>
                    <button className="size-btn">45</button>
                </div>
            </div>

        </aside>
    );
}

export default Sidebar;