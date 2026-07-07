import { useEffect, useState } from "react";
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

function Home() {
  const [products, setProducts] = useState([]);
  const [saleProducts, setSaleProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchApi = async () => {
      try {
        const [productData, saleRes] = await Promise.all([
          getProducts(),
          getSaleProducts()
        ]);

        setProducts(Array.isArray(productData) ? productData : (productData.content || []));
        setSaleProducts(Array.isArray(saleRes.data) ? saleRes.data : []);
        setIsLoading(false);
      } catch (err) {
        console.error("Lỗi khi tải sản phẩm:", err);
        setIsLoading(false);
      }
    };

    fetchApi();
  }, []);

  const brands = [
    { name: 'Nike', logo: logo_nike },
    { name: 'Converse', logo: logo_converse },
    { name: 'Adidas', logo: logo_adidas },
    { name: 'Jordan', logo: logo_jordan },
    { name: 'Vans', logo: logo_vans },
    { name: 'New Balance', logo: logo_new_balance },
  ];

  const duplicatedBrands = [...brands, ...brands];

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
            {saleProducts.slice(0, 8).map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </div>
      )}

      <div className="featuredProducts">
        <h2>NEW ARRIVALS</h2>

        {isLoading ? (
          <div style={{ textAlign: "center", padding: "50px" }}>Đang tải sản phẩm mới nhất...</div>
        ) : products.length > 0 ? (
          <div className="home-products-grid">
            {products.slice(0, 8).map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        ) : (
          <div style={{ textAlign: "center", padding: "50px" }}>Chưa có sản phẩm nào.</div>
        )}
      </div>
    </div>
  );
}

export default Home;
