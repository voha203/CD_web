import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import Sidebar from "../../components/layout/sidebar/Sidebar";
import ProductCard from "../../components/layout/productCard/ProductCard";
import { getProducts } from "../../services/api";
import { getApiErrorMessage } from "../../services/apiError";
import "./ProductList.css";

const PAGE_SIZE = 12;

function ProductList() {
    const [products, setProducts] = useState([]);
    const [pageInfo, setPageInfo] = useState({
        page: 0,
        size: PAGE_SIZE,
        totalElements: 0,
        totalPages: 0,
        first: true,
        last: true
    });
    const [currentPage, setCurrentPage] = useState(0);
    const [sortOption, setSortOption] = useState("Featured");
    const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");

    const [searchParams] = useSearchParams();
    const keyword = searchParams.get("keyword");
    const brandFromUrl = searchParams.get("brand");

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
            if (brandFromUrl && prev.brands.length === 1 && prev.brands[0] === brandFromUrl) return prev;
            if (!brandFromUrl && prev.brands.length === 0) return prev;
            return { ...prev, brands: brandFromUrl ? [brandFromUrl] : [] };
        });
    }, [brandFromUrl]);

    useEffect(() => {
        setCurrentPage(0);
    }, [sortOption, filters, keyword]);

    const productParams = useMemo(() => {
        const params = {
            page: currentPage,
            size: PAGE_SIZE,
            sortBy: "id",
            sortDir: "asc"
        };

        if (sortOption === "Price: Low to High") {
            params.sortBy = "price";
            params.sortDir = "asc";
        } else if (sortOption === "Price: High to Low") {
            params.sortBy = "price";
            params.sortDir = "desc";
        }

        if (keyword?.trim()) params.keyword = keyword.trim();
        if (filters.categoryId) params.categoryId = filters.categoryId;
        if (filters.brands?.length) params.brands = filters.brands;
        if (filters.sizes?.length) params.sizes = filters.sizes;

        let min = "";
        let max = "";
        if (filters.priceOption === "under-1m") max = "1000000";
        else if (filters.priceOption === "1m-3m") {
            min = "1000000";
            max = "3000000";
        } else if (filters.priceOption === "3m-5m") {
            min = "3000000";
            max = "5000000";
        } else if (filters.priceOption === "over-5m") min = "5000000";
        else if (filters.priceOption === "custom") {
            min = filters.customPrice.min;
            max = filters.customPrice.max;
        }

        if (min) params.minPrice = min;
        if (max) params.maxPrice = max;

        return params;
    }, [currentPage, filters, keyword, sortOption]);

    useEffect(() => {
        let active = true;
        setIsLoading(true);
        setError("");

        getProducts(productParams)
            .then(data => {
                if (!active) return;
                const content = Array.isArray(data) ? data : (data.content || []);
                setProducts(content);
                setPageInfo({
                    page: data.page ?? productParams.page,
                    size: data.size ?? PAGE_SIZE,
                    totalElements: data.totalElements ?? content.length,
                    totalPages: data.totalPages ?? 1,
                    first: data.first ?? productParams.page === 0,
                    last: data.last ?? true
                });
            })
            .catch(err => {
                if (active) setError(getApiErrorMessage(err, "Không thể tải danh sách sản phẩm."));
            })
            .finally(() => {
                if (active) setIsLoading(false);
            });

        return () => {
            active = false;
        };
    }, [productParams]);

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
            <div className="product-list-top">
                <div className="product-list-title">
                    <h2>{displayTitle}</h2>
                    <p>Hiển thị {pageInfo.totalElements || products.length} kết quả</p>
                </div>

                <div className="product-list-arrange">
                    <button className="btn-show-filter" onClick={() => setIsMobileFilterOpen(true)}>
                        Bộ lọc
                    </button>

                    <label>Sort by:</label>
                    <select value={sortOption} onChange={(e) => setSortOption(e.target.value)}>
                        <option value="Featured">Featured</option>
                        <option value="Price: Low to High">Price: Low to High</option>
                        <option value="Price: High to Low">Price: High to Low</option>
                        <option value="Customer Review">Customer Review</option>
                    </select>
                </div>
            </div>

            <main>
                {isMobileFilterOpen && (
                    <div className="sidebar-overlay" onClick={() => setIsMobileFilterOpen(false)}></div>
                )}

                <div className={`sidebar-mobile-wrapper ${isMobileFilterOpen ? "open" : ""}`}>
                    <div className="sidebar-mobile-header">
                        <h3>Bộ lọc sản phẩm</h3>
                        <button className="btn-close-filter" onClick={() => setIsMobileFilterOpen(false)}>
                            x
                        </button>
                    </div>

                    <Sidebar filters={filters} onFilterChange={(newFilters) => setFilters(newFilters)} />
                </div>

                <div className="content-wrapper">
                    <div className="text-result">
                        <h2>Results</h2>
                        <span>Check each product page for other buying options. Price and other details may vary based on product size and color.</span>
                    </div>

                    {isLoading && <div className="product-list-state">Đang tải sản phẩm...</div>}
                    {error && <div className="product-list-state error">{error}</div>}
                    {!isLoading && !error && products.length === 0 && (
                        <div className="product-list-state">Không có sản phẩm phù hợp.</div>
                    )}

                    {!isLoading && !error && products.length > 0 && (
                        <>
                            <div className="product-list-grid">
                                {products.map(product => (
                                    <ProductCard key={product.id} product={product} />
                                ))}
                            </div>

                            {pageInfo.totalPages > 1 && (
                                <div className="product-pagination">
                                    <button disabled={pageInfo.first || isLoading} onClick={() => setCurrentPage(prev => Math.max(prev - 1, 0))}>
                                        Trước
                                    </button>
                                    {Array.from({ length: pageInfo.totalPages }, (_, index) => (
                                        <button
                                            key={index}
                                            className={index === pageInfo.page ? "active" : ""}
                                            disabled={isLoading}
                                            onClick={() => setCurrentPage(index)}
                                        >
                                            {index + 1}
                                        </button>
                                    ))}
                                    <button disabled={pageInfo.last || isLoading} onClick={() => setCurrentPage(prev => prev + 1)}>
                                        Sau
                                    </button>
                                </div>
                            )}
                        </>
                    )}
                </div>
            </main>
        </div>
    );
}

export default ProductList;
