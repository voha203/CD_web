import { useEffect, useState } from "react";
import './Home.css'
import Header from "../../components/layout/header/Header";
import logo_nike from "../../assets/images/logoBrand/nike.jpg";
import logo_converse from "../../assets/images/logoBrand/converse.svg"
import logo_adidas from "../../assets/images/logoBrand/adidas.svg"
import logo_jordan from "../../assets/images/logoBrand/jordan.svg"
import logo_vans from "../../assets/images/logoBrand/vans.svg"
import logo_new_balance from "../../assets/images/logoBrand/new_balance.svg"
import ProductCard from '../../components/layout/productCard/ProductCard';
import Footer from "../../components/layout/footer/Footer";

function Home() {
  // MÔ PHỎNG DỮ LIỆU
  const sampleProducts = [
    {
      id: 1, brand: 'Nike', name: 'Nike Air Max 270 React',
      price: 3500000, isNew: true,
      imageUrl: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80'
    },
    {
      id: 2, brand: 'Jordan', name: 'Air Jordan 1 Retro High OG Black Toe',
      price: 4800000, oldPrice: 6000000, salePercentage: 20,
      imageUrl: 'https://images.unsplash.com/photo-1608231387042-66d1773070a5?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80'
    },
  ];

  const [products, setProducts] = useState([]);

  useEffect(() => {
    fetch("http://localhost:8080/api/products")
      .then(res => res.json())
      .then(data => {
        console.log("DATA:", data);
        setProducts(data);
      })
      .catch(err => console.error(err));
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

  // if (products.length === 0) {
  //   return (
  //     <div>
  //       <h1>Shop Sneaker</h1>
  //       <p>Đang tải...</p>
  //     </div>
  //   );
  // }

  return (
    // products.map(p => (
    //   <div key={p.id}>
    //     {p.name} - {p.price}
    //   </div>
    // ))
    <div>
      {/* HEADER */}
      <Header />

      {/* BANNER BỰ THU HÚT NGƯỜI NHÌN */}
      <div className="hero-container">
        <div className="hero-overlay"></div>

        <div className="hero-content">
          <h1 className="hero-title">New Era of Streetwear</h1>
          <p className="hero-subtitle">Khám phá những bộ sưu tập Sneaker độc quyền và hot nhất mùa này. Bước đi tự tin, khẳng định chất riêng.</p>
          <button className="hero-btn">Shop The Collection</button>
        </div>
      </div>

      {/* DẢI LOGO BRAND TỰ ĐỘNG CHẠY */}
      <div className="marquee-section">
        <div className="marquee-container">
          <div className="marquee-track">
            {duplicatedBrands.map((brand, index) => (
              <div key={index} className="marquee-item" title={brand.name}>
                <img src={brand.logo} alt={brand.name} />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* HIỂN THỊ NHỮNG SẢN PHẨM "HÀNG MỚI VỀ", "BÁN CHẠY NHẤT", "ĐANG GIẢM GIÁ" */}
      <div className="featuredProducts">
        <h2>NEW ARRIVALS</h2>
        <div className="products-grid">
          {sampleProducts.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </div>

      {/* FOOTER */}
      <Footer />
    </div>
  );
}

export default Home;