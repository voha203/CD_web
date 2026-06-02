import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import Sidebar from "../../components/layout/sidebar/Sidebar";
import ProductCard from '../../components/layout/productCard/ProductCard';
import './ProductList.css'

function ProductList() {
    const [products, setProducts] = useState([]);

    // Đọc parameters từ URL do Header đẩy sang
    const [searchParams] = useSearchParams();
    const keyword = searchParams.get("keyword");
    const brandFromUrl = searchParams.get("brand");

    // Lưu tiêu chí sắp xếp sản phẩm hiện tại của người dùng
    const [sortOption, setSortOption] = useState("Featured");

    // Lưu thuộc tính bộ lọc sản phẩm
    const [filters, setFilters] = useState({
        categoryId: null,
        categoryName: null,
        brands: brandFromUrl ? [brandFromUrl] : [],
        priceOption: "",
        customPrice: { min: "", max: "" },
        sizes: []
    });

    useEffect(() => {
        setFilters(prev => {
            if (brandFromUrl && prev.brands.length === 1 && prev.brands[0] === brandFromUrl) {
                return prev;
            }
            if (!brandFromUrl && prev.brands.length === 0) {
                return prev;
            }
            return {
                ...prev,
                brands: brandFromUrl ? [brandFromUrl] : []
            };
        });
    }, [brandFromUrl]);

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

        // Nếu có từ khóa tìm kiếm trên url, đưa vào API
        if (keyword) {
            params.append("keyword", keyword.trim());
        }

        if (filters.categoryId) {
            params.append("categoryId", filters.categoryId);
        }

        // Xử lý Lọc theo Hãng (Nối chuỗi ?brands=Nike,Adidas)
        if (filters.brands && filters.brands.length > 0) {
            params.append("brands", filters.brands.join(","));
        }

        // Xử lý Lọc theo Kích cỡ (Nối chuỗi ?sizes=40,41)
        if (filters.sizes && filters.sizes.length > 0) {
            params.append("sizes", filters.sizes.join(","));
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
    }, [sortOption, filters, keyword]);

    let displayTitle = "Tất cả sản phẩm";
    if (keyword && filters.categoryName) {
        displayTitle = `Kết quả tìm kiếm "${keyword}" trong danh mục ${filters.categoryName}`;
    } else if (keyword) {
        displayTitle = `Kết quả tìm kiếm cho "${keyword}"`;
    } else if (filters.brands && filters.brands.length === 1) {
        displayTitle = `Bộ sưu tập giày ${filters.brands[0]}`;
    } else if (filters.categoryName) {
        displayTitle = `Kết quả tìm kiếm cho ${filters.categoryName}`;
    }

    return (
        <div className="product-list-container">
            {/* Thanh đếm số lượng tìm kiếm và sắp xếp danh sách theo yêu cầu */}
            <div className="product-list-top">
                {/* Tiêu đề và kết quả tìm kiếm */}
                <div className="product-list-title">
                    <h2>{displayTitle}</h2>
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
                <Sidebar filters={filters} onFilterChange={(newFilters) => setFilters(newFilters)} />

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
        </div >
    );
}

export default ProductList;