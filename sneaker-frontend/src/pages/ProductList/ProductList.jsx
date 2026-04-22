import React from "react";
import Header from "../../components/layout/header/Header";
import Footer from "../../components/layout/footer/Footer";
import Sidebar from "../../components/layout/sidebar/Sidebar";
import ProductCard from '../../components/layout/productCard/ProductCard';
import './ProductList.css'

function ProductList() {

    // Tạo tạm một mảng dữ liệu để test (Sau này sẽ gọi từ Spring Boot)
    const products = [
        { id: 1, brand: 'Nike', name: 'Air Max 270', price: 3500000, imageUrl: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400' },
        { id: 2, brand: 'Adidas', name: 'Ultraboost 22', price: 4200000, imageUrl: 'https://images.unsplash.com/photo-1608231387042-66d1773070a5?w=400' },
        { id: 3, brand: 'Jordan', name: 'Air Jordan 1', price: 5500000, imageUrl: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400' },
        { id: 4, brand: 'Puma', name: 'RS-X3', price: 2800000, imageUrl: 'https://images.unsplash.com/photo-1608231387042-66d1773070a5?w=400' },
        { id: 5, brand: 'Converse', name: 'Chuck Taylor', price: 1500000, imageUrl: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400' },
        { id: 6, brand: 'Vans', name: 'Old Skool', price: 1800000, imageUrl: 'https://images.unsplash.com/photo-1608231387042-66d1773070a5?w=400' },
    ];

    return (
        <div className="product-list-container">
            <Header />

            {/* Thanh đếm số lượng tìm kiếm và sắp xếp danh sách theo yêu cầu */}
            <div className="product-list-top">
                {/* Tiêu đề và kết quả tìm kiếm */}
                <div className="product-list-title">
                    <h2>Kết quả tìm kiếm cho "Sneakers"</h2>
                    <p>Hiển thị {products.length} kết quả</p>
                </div>

                {/* Bộ lọc sắp xếp theo yêu cầu */}
                <div className="product-list-arrange">
                    <label>Sort by:</label>
                    <select>
                        <option>Featured</option>
                        <option>Price: Low to High</option>
                        <option>Price: High to Low</option>
                        <option>Customer Review</option>
                    </select>
                </div>
            </div>

            {/* Nội dung trang danh sách */}
            <main>
                {/* Sidebar */}
                <Sidebar />

                <div>
                    <div className="text-result">
                        <h2>Results</h2>
                        <span>Check each product page for other buying options. Price and other details may vary based on product size and color.</span>
                    </div>

                    <div className="product-list-grid">
                        {products.map(product => (
                            <ProductCard key={product.id} product={product} />
                        ))}
                    </div>
                </div>
            </main>

            <Footer />
        </div >
    );
}

export default ProductList;