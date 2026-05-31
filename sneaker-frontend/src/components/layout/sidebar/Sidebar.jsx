import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import './Sidebar.css';

function Sidebar({ onFilterChange }) {
    // Khai báo hook để đọc URL
    const [searchParams] = useSearchParams();
    const urlCategory = searchParams.get("category");
    const urlBrand = searchParams.get("brand");

    const [selectedBrands, setSelectedBrands] = useState(urlBrand ? [urlBrand] : []);
    const [priceRange, setPriceRange] = useState("");
    const [minPrice, setMinPrice] = useState("");
    const [maxPrice, setMaxPrice] = useState("");
    const [selectedSizes, setSelectedSizes] = useState([]);

    const [categories, setCategories] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState(null);

    // Lấy danh mục từ Backend khi load trang
    useEffect(() => {
        fetch("http://localhost:8080/api/categories")
            .then(res => res.json())
            .then(data => setCategories(data))
            .catch(err => console.error("Lỗi khi lấy danh mục:", err));
    }, []);

    // THEO DÕI URL: Nếu trên URL có category, tự động mapping tên danh mục sang ID để Sidebar tô đậm đúng chỗ
    useEffect(() => {
        if (categories.length > 0) {
            if (urlCategory && urlCategory !== "All") {
                const matchedCat = categories.find(c => c.name.toLowerCase() === urlCategory.toLowerCase());
                if (matchedCat) {
                    setSelectedCategory(matchedCat.id);
                }
            } else {
                // Nếu URL là All hoặc không có, bỏ chọn ở Sidebar
                setSelectedCategory(null);
            }
        }
    }, [urlCategory, categories]);

    useEffect(() => {
        if (urlBrand) {
            setSelectedBrands([urlBrand]);
        }
    }, [urlBrand]);

    // Xử lý khi người dùng click vào một danh mục
    const handleCategoryClick = (e, id) => {
        e.preventDefault(); // Ngăn trình duyệt load lại trang do thẻ <a>
        // Nếu bấm lại vào cái đang chọn thì bỏ chọn (set null), nếu bấm cái khác thì gán id mới
        setSelectedCategory(prevId => prevId === id ? null : id);
    };

    // Xử lý khi chọn/bỏ chọn Thương hiệu
    const handleBrandChange = (e) => {
        const value = e.target.value;
        if (e.target.checked) {
            setSelectedBrands([...selectedBrands, value]);
        } else {
            setSelectedBrands(selectedBrands.filter(brand => brand !== value));
        }
    };

    // Xử lý khi chọn khoảng giá có sẵn (Radio)
    const handleRadioPriceChange = (e) => {
        setPriceRange(e.target.value);
        // Xóa giá trị trong ô nhập tay nếu người dùng chọn radio
        setMinPrice("");
        setMaxPrice("");
    };

    // Xử lý khi bấm nút "Áp dụng mức giá" nhập tay
    const handleCustomPriceSubmit = () => {
        // Kiểm tra xem người dùng có nhập gì không (xóa bỏ khoảng trắng dư thừa)
        const min = minPrice.toString().trim();
        const max = maxPrice.toString().trim();

        if (min === "" && max === "") {
            // NẾU ĐỂ TRỐNG CẢ 2 Ô -> CHUYỂN VỀ TRẠNG THÁI 'ALL' (RESET)
            setPriceRange("all");
            triggerFilterChange("all");
        } else {
            // NẾU CÓ NHẬP ÍT NHẤT 1 Ô -> ÁP DỤNG LỌC CUSTOM
            setPriceRange("custom");
            triggerFilterChange("custom");
        }
    };

    // Xử lý khi chọn/bỏ chọn Kích cỡ
    const handleSizeToggle = (size) => {
        if (selectedSizes.includes(size)) {
            setSelectedSizes(selectedSizes.filter(s => s !== size));
        } else {
            setSelectedSizes([...selectedSizes, size]);
        }
    };

    // Sử dụng useEffect để theo dõi, mỗi khi các State thay đổi thì gửi lên ProductList
    useEffect(() => {
        triggerFilterChange(priceRange);
    }, [selectedBrands, selectedSizes, priceRange, selectedCategory, categories]); // Chạy lại khi mảng này thay đổi

    const triggerFilterChange = (currentPriceRange) => {
        if (onFilterChange) {
            const activeCategoryObj = categories.find(c => c.id === selectedCategory);

            onFilterChange({
                categoryId: selectedCategory,
                categoryName: activeCategoryObj ? activeCategoryObj.name : null,
                brands: selectedBrands,
                priceOption: currentPriceRange,
                customPrice: { min: minPrice, max: maxPrice },
                sizes: selectedSizes
            });
        }
    };

    return (
        <aside className="sidebar-wrapper">

            {/* KHỐI 1: DANH MỤC */}
            <div className="filter-section">
                <h3 className="filter-heading">Danh mục</h3>
                <ul className="category-list">
                    {categories.map((category) => (
                        <li key={category.id}>
                            <a
                                href="#"
                                // Nếu ID đang chọn trùng với ID của category này thì thêm class 'active' (để bạn tự CSS tô đậm lên)
                                className={`category-link ${selectedCategory === category.id ? 'active-category' : ''}`}
                                onClick={(e) => handleCategoryClick(e, category.id)}
                            >
                                {category.name}
                            </a>
                        </li>
                    ))}
                </ul>
            </div>

            {/* KHỐI 2: THƯƠNG HIỆU */}
            <div className="filter-section">
                <h3 className="filter-heading">Thương hiệu</h3>
                <div>
                    <div className="checkbox-group">
                        <input type="checkbox" id="brand-nike" value="Nike" checked={selectedBrands.includes("Nike")} onChange={handleBrandChange} />
                        <label htmlFor="brand-nike" className="checkbox-label">Nike</label>
                    </div>
                    <div className="checkbox-group">
                        <input type="checkbox" id="brand-adidas" value="Adidas" checked={selectedBrands.includes("Adidas")} onChange={handleBrandChange} />
                        <label htmlFor="brand-adidas" className="checkbox-label">Adidas</label>
                    </div>
                    <div className="checkbox-group">
                        <input type="checkbox" id="brand-jordan" value="Air Jordan" checked={selectedBrands.includes("Air Jordan")} onChange={handleBrandChange} />
                        <label htmlFor="brand-jordan" className="checkbox-label">Air Jordan</label>
                    </div>
                    <div className="checkbox-group">
                        <input type="checkbox" id="brand-converse" value="Converse" checked={selectedBrands.includes("Converse")} onChange={handleBrandChange} />
                        <label htmlFor="brand-converse" className="checkbox-label">Converse</label>
                    </div>
                    <div className="checkbox-group">
                        <input type="checkbox" id="brand-new-balance" value="New Balance" checked={selectedBrands.includes("New Balance")} onChange={handleBrandChange} />
                        <label htmlFor="brand-new-balance" className="checkbox-label">New Balance</label>
                    </div>
                    <div className="checkbox-group">
                        <input type="checkbox" id="brand-vans" value="Vans" checked={selectedBrands.includes("Vans")} onChange={handleBrandChange} />
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
                        <input type="radio" name="price-filter" value="under-1m" className="radio-input" checked={priceRange === "under-1m"} onChange={handleRadioPriceChange} onClick={(e) => {
                            if (priceRange === e.target.value) {
                                setPriceRange("");
                            }
                        }} />
                        <span className="radio-text">Dưới 1.000.000₫</span>
                    </label>
                    <label className="radio-label">
                        <input type="radio" name="price-filter" value="1m-3m" className="radio-input" checked={priceRange === "1m-3m"} onChange={handleRadioPriceChange} onClick={(e) => {
                            if (priceRange === e.target.value) {
                                setPriceRange("");
                            }
                        }} />
                        <span className="radio-text">1.000.000₫ - 3.000.000₫</span>
                    </label>
                    <label className="radio-label">
                        <input type="radio" name="price-filter" value="3m-5m" className="radio-input" checked={priceRange === "3m-5m"} onChange={handleRadioPriceChange} onClick={(e) => {
                            if (priceRange === e.target.value) {
                                setPriceRange("");
                            }
                        }} />
                        <span className="radio-text">3.000.000₫ - 5.000.000₫</span>
                    </label>
                    <label className="radio-label">
                        <input type="radio" name="price-filter" value="over-5m" className="radio-input" checked={priceRange === "over-5m"} onChange={handleRadioPriceChange} onClick={(e) => {
                            if (priceRange === e.target.value) {
                                setPriceRange("");
                            }
                        }} />
                        <span className="radio-text">Trên 5.000.000₫</span>
                    </label>
                </div>

                {/* Khu vực nhập giá tự do */}
                <div className="custom-price-area">
                    <div className="price-inputs-row">
                        <div className="input-wrapper">
                            <input type="number" placeholder="TỐI THIỂU" className="price-input-new" value={minPrice} onChange={(e) => setMinPrice(e.target.value)} />
                            <span className="currency-badge">₫</span>
                        </div>
                        <span className="price-separator">-</span>
                        <div className="input-wrapper">
                            <input type="number" placeholder="TỐI ĐA" className="price-input-new" value={maxPrice} onChange={(e) => setMaxPrice(e.target.value)} />
                            <span className="currency-badge">₫</span>
                        </div>
                    </div>
                    <button className="price-submit-btn" onClick={handleCustomPriceSubmit}>Áp dụng mức giá</button>
                </div>
            </div>

            {/* KHỐI 4: KÍCH CỠ */}
            <div className="filter-section">
                <h3 className="filter-heading">Kích cỡ</h3>
                <div className="size-grid">
                    {[24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45].map(size => (
                        <button
                            key={size}
                            type="button"
                            className={`size-btn ${selectedSizes.includes(size) ? 'active-size' : ''}`}
                            onClick={() => handleSizeToggle(size)}
                        >
                            {size}
                        </button>
                    ))}
                </div>
            </div>

        </aside>
    );
}

export default Sidebar;