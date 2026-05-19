import { useEffect, useState } from "react";
import Header from "../../components/layout/header/Header";
import Footer from "../../components/layout/footer/Footer";
import Sidebar from "../../components/layout/sidebar/Sidebar";
import ProductCard from '../../components/layout/productCard/ProductCard';
import './ProductList.css'

function ProductList() {
    const [products, setProducts] = useState([]);

    // Lưu tiêu chí sắp xếp sản phẩm hiện tại của người dùng
    const [sortOption, setSortOption] = useState("Featured");

    // Lấy dữ liệu từ cơ sở dữ liệu
    useEffect(() => {
        let url = "http://localhost:8080/api/products"

        // Kiểm tra lựa chọn của người dùng hiện tại để tạo ra URL phù hợp
        // Điều kiện lọc sản phẩm hiện tại
        switch (sortOption) {
            case "Price: Low to High":
                url += "?sortBy=price&sortDir=asc";
                break;
            case "Price: High to Low":
                url += "?sortBy=price&sortDir=desc";
                break;
            case "Customer Review":
                // Hiện tại chưa cần xử lí có thể xử lí tạm
                break;
            case "Featured":
            default:
                url += "?sortBy=id&sortDir=asc"; // Sắp xếp mặc định
                break;
        }

        fetch(url)
            .then(res => res.json())
            .then(data => {
                setProducts(data);
            })
            .catch(err => console.error(err));
    }, [sortOption]);

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
                    <select value={sortOption} onChange={(e) => setSortOption(e.target.value)}>
                        <option value="Featured">Featured</option>
                        <option value="Price: Low to High">Price: Low to High</option>
                        <option value="Price: High to Low">Price: High to Low</option>
                        <option value="Customer Review">Customer Review</option>
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