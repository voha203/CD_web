import React, { useState } from "react";
import './ProductDetail.css'
import Header from "../../components/layout/header/Header"
import Footer from "../../components/layout/footer/Footer";

function ProductDetail() {
    // Mảng chứa các đường dẫn ảnh (Sau này có thể lấy từ API Backend Spring Boot truyền vào)
    const images = [
        "https://static.nike.com/a/images/t_web_pdp_936_v2/f_auto,u_9ddf04c7-2a9a-4d76-add1-d15af8f0263d,c_scale,fl_relative,w_1.0,h_1.0,fl_layer_apply/b7d9211c-26e7-431a-ac24-b0540fb3c00f/AIR+FORCE+1+%2707.png",
        "https://static.nike.com/a/images/t_web_pdp_936_v2/f_auto,u_9ddf04c7-2a9a-4d76-add1-d15af8f0263d,c_scale,fl_relative,w_1.0,h_1.0,fl_layer_apply/f2730a31-0d4d-402f-9d93-b484ea17e62c/NIKE+P-6000.png",
        "https://static.nike.com/a/images/t_web_pdp_936_v2/f_auto,u_9ddf04c7-2a9a-4d76-add1-d15af8f0263d,c_scale,fl_relative,w_1.0,h_1.0,fl_layer_apply/2a77c267-b278-4912-817f-762b2a25006b/W+AIR+FORCE+1+%2707+PRM%2B.png",
        "https://static.nike.com/a/images/t_web_pdp_936_v2/f_auto,u_9ddf04c7-2a9a-4d76-add1-d15af8f0263d,c_scale,fl_relative,w_1.0,h_1.0,fl_layer_apply/1b7b84f5-4b31-4354-a62f-98f2661b507e/G.T.+JUMP+ACADEMY+EP.png"
    ];

    // State lưu vị trí ảnh đang được chọn (mặc định là 0 - ảnh đầu tiên)
    const [currentIndex, setCurrentIndex] = useState(0);

    // Hàm xử lý nút Next
    const handleNext = () => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
    };

    // Hàm xử lý nút Prev
    const handlePrev = () => {
        setCurrentIndex((prevIndex) => (prevIndex === 0 ? images.length - 1 : prevIndex - 1));
    };

    // State quản lý việc đóng/mở phần Delivery (mặc định là đóng - false)
    const [isDeliveryOpen, setIsDeliveryOpen] = useState(false);

    return (
        <div className="product-detail-container">
            <Header />

            <div className="product-detail">

                {/* =================== CỘT  TRÁI: DANH SÁCH HÌNH ẢNH SẢN PHẨM ================ */}
                <div className="gallery-section">
                    <div className="thumbnails">
                        {images.map((img, index) => (
                            <img
                                key={index}
                                src={img}
                                alt={`thumbnail-${index}`}
                                className={currentIndex === index ? 'active' : ''}
                                onMouseEnter={() => setCurrentIndex(index)}
                            />
                        ))}
                    </div>

                    <div className="main-image-container">
                        <img src={images[currentIndex]} alt="main-product" />

                        <div className="nav-buttons">
                            <button className="nav-btn" onClick={handlePrev}>
                                <span class="material-symbols-outlined">
                                    chevron_backward
                                </span>
                            </button>
                            <button className="nav-btn" onClick={handleNext}>
                                <span class="material-symbols-outlined">
                                    chevron_right
                                </span>
                            </button>
                        </div>
                    </div>
                </div>

                {/* =================== CỘT PHẢI: CHI TIẾT SẢN PHẨM ================== */}
                <div className="details-section">
                    <div>
                        <h1 className="product-title">Nike Air Force 1 '07</h1>
                        <p className="product-subtitle">Men's Shoes</p>
                        <p className="product-price">2,929,000₫</p>
                    </div>

                    <div className="colors">
                        {images.map((img, index) => (
                            <img
                                key={index}
                                src={img}
                                alt={`thumbnail-${index}`}
                                className={currentIndex === index ? 'active' : ''}
                                onClick={() => setCurrentIndex(index)}
                            />
                        ))}
                    </div>

                    <div className="size-section">
                        <div className="size-header">
                            <span className="size-header-text">Select Size</span>

                            <div className="size-header-guide">
                                <span class="material-symbols-outlined">
                                    straighten
                                </span>
                                <span className="size-guide">Size Guide</span>
                            </div>
                        </div>
                        <div className="size-grid">
                            {['38.5', '39', '40', '40.5', '41', '42', '42.5', '43', '44'].map(size => (
                                <div key={size} className="size-box">EU {size}</div>
                            ))}
                        </div>
                    </div>

                    <div className="action-buttons">
                        <button className="btn btn-add">Add to Bag</button>
                        <button className="btn btn-fav">Favourite
                            <span class="material-symbols-outlined">
                                favorite
                            </span>
                        </button>
                    </div>

                    {/* ===================== Phần thông tin sản phẩm ================= */}
                    <div className="details-information">
                        <div className="description-section">
                            <p className="description-text">Understated elegance delivers big with this AF-1. Real and synthetic leather combine for a textured and monochromatic backdrop that lets subtle floral details elevate the classic silhouette.</p>
                            <div className="attribute">
                                <ul>
                                    <li>
                                        <p className="colour-shown">Colour Shown: Off-White/Light Smoke Grey/Off-White</p>
                                    </li>
                                    <li>
                                        <p className="style">Style: HV4406-100</p>
                                    </li>
                                    <li>
                                        <p className="country">Country/Region of Origin: Vietnam</p>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>

                    {/* ===================== Phần Delivery & Returns (Accordion) ================= */}
                    <div className="accordion-section">
                        <div 
                            className="accordion-header" 
                            onClick={() => setIsDeliveryOpen(!isDeliveryOpen)}
                        >
                            <h3>Free Delivery and Returns</h3>
                            <span 
                                className="material-symbols-outlined"
                                style={{ 
                                    transform: isDeliveryOpen ? 'rotate(180deg)' : 'rotate(0deg)',
                                    transition: 'transform 0.3s ease'
                                }}
                            >
                                expand_more
                            </span>
                        </div>

                        <div className={`accordion-content-wrapper ${isDeliveryOpen ? 'open' : ''}`}>
                            <div className="accordion-content">
                                <p>Your order of 5.000.000₫ or more gets free standard delivery.</p>
                                <ul>
                                    <li>Standard delivered 4-5 Business Days</li>
                                    <li>Express delivered 2-4 Business Days</li>
                                </ul>
                                <p>Orders are processed and delivered Monday-Friday (excluding public holidays)</p>
                                <p className="text">mysneaker Members enjoy <a href="#!">free returns</a>.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <Footer />
        </div >
    );
}

export default ProductDetail;