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

    // Lưu thuộc tính bộ lọc sản phẩm
    const [filters, setFilters] = useState({ categoryId: null, categoryName: null, brands: [], priceOption: "", customPrice: { min: "", max: "" } });

    // Lấy dữ liệu từ cơ sở dữ liệu
    useEffect(() => {
        let url = "http://localhost:8080/api/products"
        let params = new URLSearchParams();

        // Kiểm tra lựa chọn của người dùng hiện tại để tạo ra URL phù hợp
        // Điều kiện lọc sản phẩm hiện tại
        switch (sortOption) {
            case "Price: Low to High":
                params.append("sortBy", "price");
                params.append("sortDir", "asc");
                break;
            case "Price: High to Low":
                params.append("sortBy", "price");
                params.append("sortDir", "desc");
                break;
            case "Customer Review":
                // Hiện tại chưa cần xử lí có thể xử lí tạm
                break;
            case "Featured":
            default:
                params.append("sortBy", "id");
                params.append("sortDir", "asc"); // Sắp xếp mặc định
                break;
        }

        if (filters.categoryId) {
            params.append("categoryId", filters.categoryId);
        }

        // Xử lý Lọc theo Hãng (Nối chuỗi ?brands=Nike&brands=Adidas...)
        if (filters.brands.length > 0) {
            filters.brands.forEach(b => params.append("brands", b));
        }

        // Xử lý Lọc theo Giá (Tính toán khoảng Min - Max dựa vào option được chọn)
        let min = "";
        let max = "";
        if (filters.priceOption === "under-1m") { max = "1000000"; }
        else if (filters.priceOption === "1m-3m") { min = "1000000"; max = "3000000"; }
        else if (filters.priceOption === "3m-5m") { min = "3000000"; max = "5000000"; }
        else if (filters.priceOption === "over-5m") { min = "5000000"; }
        else if (filters.priceOption === "custom") {
            min = filters.customPrice.min;
            max = filters.customPrice.max;
        }

        if (min) params.append("minPrice", min);
        if (max) params.append("maxPrice", max);

        fetch(`${url}?${params.toString()}`)
            .then(res => res.json())
            .then(data => {
                setProducts(data);
            })
            .catch(err => console.error(err));
    }, [sortOption, filters]);

    return (
        <div className="product-list-container">
            <Header />

            {/* Thanh đếm số lượng tìm kiếm và sắp xếp danh sách theo yêu cầu */}
            <div className="product-list-top">
                {/* Tiêu đề và kết quả tìm kiếm */}
                <div className="product-list-title">
                    <h2>
                        {filters.categoryName ? `Kết quả tìm kiếm cho ${filters.categoryName}` : "Tất cả sản phẩm"}
                    </h2>
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
                <Sidebar onFilterChange={(newFilters) => setFilters(newFilters)} />

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