import { useEffect, useRef, useState } from "react";
import { useNavigate } from 'react-router-dom';
import './Home.css'
import logo_nike from "../../assets/images/logoBrand/nike.jpg";
import logo_converse from "../../assets/images/logoBrand/converse.svg"
import logo_adidas from "../../assets/images/logoBrand/adidas.svg"
import logo_jordan from "../../assets/images/logoBrand/jordan.svg"
import logo_vans from "../../assets/images/logoBrand/vans.svg"
import logo_new_balance from "../../assets/images/logoBrand/new_balance.svg"
import ProductCard from '../../components/layout/productCard/ProductCard';

import { getProducts } from "../../services/api";
import { getSaleProducts } from "../../services/discountService";

const HOME_PAGE_SIZE = 8;

function Home() {
  const [products, setProducts] = useState([]);
  const [productPage, setProductPage] = useState(0);
  const [productPageInfo, setProductPageInfo] = useState({
    page: 0,
    totalPages: 1,
    first: true,
    last: true,
    totalElements: 0
  });
  const [saleProducts, setSaleProducts] = useState([]);
  const [salePage, setSalePage] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [isProductPageLoading, setIsProductPageLoading] = useState(false);
  const hasLoadedInitialProducts = useRef(false);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchApi = async () => {
      try {
        const [productData, saleRes] = await Promise.all([
          getProducts({ page: 0, size: HOME_PAGE_SIZE, sortBy: "id", sortDir: "desc" }),
          getSaleProducts()
        ]);

        const content = Array.isArray(productData) ? productData : (productData.content || []);
        setProducts(content);
        setProductPageInfo({
          page: productData.page ?? 0,
          totalPages: productData.totalPages ?? 1,
          first: productData.first ?? true,
          last: productData.last ?? true,
          totalElements: productData.totalElements ?? content.length
        });
        hasLoadedInitialProducts.current = true;
        setSaleProducts(Array.isArray(saleRes.data) ? saleRes.data : []);
        setIsLoading(false);
      } catch (err) {
        console.error("Lỗi khi tải sản phẩm:", err);
        setIsLoading(false);
      }
    };

    fetchApi();
  }, []);

  useEffect(() => {
    if (!hasLoadedInitialProducts.current) return;

    let active = true;
    setIsProductPageLoading(true);

    getProducts({ page: productPage, size: HOME_PAGE_SIZE, sortBy: "id", sortDir: "desc" })
      .then(productData => {
        if (!active) return;
        const content = Array.isArray(productData) ? productData : (productData.content || []);

        setProducts(content);
        setProductPageInfo({
          page: productData.page ?? productPage,
          totalPages: productData.totalPages ?? 1,
          first: productData.first ?? productPage === 0,
          last: productData.last ?? true,
          totalElements: productData.totalElements ?? content.length
        });
      })
      .catch(err => {
        console.error("Lá»—i khi táº£i trang sáº£n pháº©m:", err);
      })
      .finally(() => {
        if (active) setIsProductPageLoading(false);
      });

    return () => {
      active = false;
    };
  }, [productPage]);

  const brands = [
    { name: 'Nike', logo: logo_nike },
    { name: 'Converse', logo: logo_converse },
    { name: 'Adidas', logo: logo_adidas },
    { name: 'Jordan', logo: logo_jordan },
    { name: 'Vans', logo: logo_vans },
    { name: 'New Balance', logo: logo_new_balance },
  ];

  const duplicatedBrands = [...brands, ...brands];
  const saleTotalPages = Math.max(1, Math.ceil(saleProducts.length / HOME_PAGE_SIZE));
  const currentSaleProducts = saleProducts.slice(
    salePage * HOME_PAGE_SIZE,
    salePage * HOME_PAGE_SIZE + HOME_PAGE_SIZE
  );

  const renderPagination = ({ totalPages, page, first, last, onPageChange, loading = false }) => {
    if (totalPages <= 1) return null;

    return (
      <div className="home-pagination">
        <button
          type="button"
          disabled={first || loading}
          onClick={() => onPageChange(Math.max(page - 1, 0))}
        >
          Trước
        </button>

        {Array.from({ length: totalPages }, (_, index) => (
          <button
            key={index}
            type="button"
            className={index === page ? "active" : ""}
            disabled={loading}
            onClick={() => onPageChange(index)}
          >
            {index + 1}
          </button>
        ))}

        <button
          type="button"
          disabled={last || loading}
          onClick={() => onPageChange(Math.min(page + 1, totalPages - 1))}
        >
          Sau
        </button>
      </div>
    );
  };

  return (
    <div>
      {/* BANNER BỰ THU HÚT NGƯỜI NHÌN */}
      <div className="hero-container">
        <div className="hero-overlay"></div>

        <div className="hero-content">
          <h1 className="hero-title">New Era of Streetwear</h1>
          <p className="hero-subtitle">Khám phá những bộ sưu tập Sneaker độc quyền và hot nhất mùa này. Bước đi tự tin, khẳng định chất riêng.</p>
          <button
            className="hero-btn"
            onClick={() => navigate('/products')}
          >
            Shop The Collection
          </button>
        </div>
      </div>

      {/* DẢI LOGO BRAND TỰ ĐỘNG CHẠY */}
      <div className="marquee-section">
        <div className="marquee-container">
          <div className="marquee-track">
            {duplicatedBrands.map((brand, index) => (
              <div
                key={index}
                className="marquee-item"
                title={brand.name}
                style={{ cursor: "pointer" }}
                onClick={() => navigate(`/products?brand=${encodeURIComponent(brand.name)}`)}
              >
                <img src={brand.logo} alt={brand.name} />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* HIỂN THỊ NHỮNG SẢN PHẨM "HÀNG MỚI VỀ", "BÁN CHẠY NHẤT", "ĐANG GIẢM GIÁ" */}
      {!isLoading && saleProducts.length > 0 && (
        <div className="featuredProducts saleProducts">
          <div className="section-heading-row">
            <h2>SẢN PHẨM KHUYẾN MÃI</h2>
            <button type="button" onClick={() => navigate('/products')}>Xem tất cả</button>
          </div>

          <div className="home-products-grid">
            {currentSaleProducts.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>

          {renderPagination({
            totalPages: saleTotalPages,
            page: salePage,
            first: salePage === 0,
            last: salePage >= saleTotalPages - 1,
            onPageChange: setSalePage
          })}
        </div>
      )}

      <div className="featuredProducts">
        <h2>NEW ARRIVALS</h2>

        {isLoading ? (
          <div style={{ textAlign: "center", padding: "50px" }}>Đang tải sản phẩm mới nhất...</div>
        ) : products.length > 0 ? (
          <>
            {isProductPageLoading && (
              <div className="home-page-loading">Đang chuyển trang sản phẩm...</div>
            )}

            <div className="home-products-grid">
              {products.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>

            {renderPagination({
              totalPages: productPageInfo.totalPages,
              page: productPageInfo.page,
              first: productPageInfo.first,
              last: productPageInfo.last,
              onPageChange: setProductPage,
              loading: isProductPageLoading
            })}
          </>
        ) : (
          <div style={{ textAlign: "center", padding: "50px" }}>Chưa có sản phẩm nào.</div>
        )}
      </div>
    </div>
  );
}

export default Home;
