import React, { useState } from "react";
import { useParams } from 'react-router-dom';
import './ProductDetail.css'
import Header from "../../components/layout/header/Header"
import Footer from "../../components/layout/footer/Footer";

import { useProductDetail } from "../../components/hooks/useProductDetail";

function ProductDetail() {
    // Lấy id từ trên thanh URL xuống
    const { id } = useParams();

    const {
        product,
        loading,
        reviews,
        reviewStats,
        currentPage,
        setCurrentPage,
        isSubmitting,
        addReview
    } = useProductDetail(id);

    // Quản lý xem đang xem màu (variant) thứ mấy
    const [selectedVariantIndex, setSelectedVariantIndex] = useState(0);
    // State lưu vị trí ảnh đang được chọn (mặc định là 0 - ảnh đầu tiên)
    const [currentIndex, setCurrentIndex] = useState(0);

    // State quản lý việc đóng/mở phần Delivery và Reviews (mặc định là đóng - false)
    const [isDeliveryOpen, setIsDeliveryOpen] = useState(false);
    const [isReviewsOpen, setIsReviewsOpen] = useState(false);

    // State cho Form gửi đánh giá
    const [newReview, setNewReview] = useState({ rating: 5, comment: "" });

    // Hàm gửi đánh giá mới
    const handleReviewSubmit = async (e) => {
        e.preventDefault();
        const success = await addReview(newReview);
        if (success) {
            setNewReview({ rating: 5, comment: "" });   // Gửi thành công thì reset form
        }
    };

    // Hiển thị trong lúc chờ gọi API
    if (loading) {
        return <h2>Đang tải thông tin sản phẩm...</h2>;
    }

    // Nếu không tìm thấy sản phẩm
    if (!product) {
        return <h2>Không tìm thấy sản phẩm!</h2>;
    }

    // Map mảng object thành mảng các chuỗi URL
    const currentVariant = product.variants?.[selectedVariantIndex];
    const rawImages = currentVariant?.images || [];
    let images = rawImages.map(img => {
        let url = img.imageUrl;
        if (!url.startsWith("http")) {
            return `http://localhost:8080${url}`;
        }
        return url;
    });

    // Nếu không có ảnh, chèn 1 ảnh mặc định vào mảng
    if (images.length === 0) {
        images.push("https://via.placeholder.com/600");
    }

    // Hàm xử lý nút Next
    const handleNext = () => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
    };

    // Hàm xử lý nút Prev
    const handlePrev = () => {
        setCurrentIndex((prevIndex) => (prevIndex === 0 ? images.length - 1 : prevIndex - 1));
    };

    // Hàm đổi màu (đổi Variant)
    const handleVariantChange = (index) => {
        setSelectedVariantIndex(index);
        setCurrentIndex(0); // Reset về ảnh đầu tiên của màu mới
    };

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
                                <span className="material-symbols-outlined">
                                    chevron_backward
                                </span>
                            </button>
                            <button className="nav-btn" onClick={handleNext}>
                                <span className="material-symbols-outlined">
                                    chevron_right
                                </span>
                            </button>
                        </div>
                    </div>
                </div>

                {/* =================== CỘT PHẢI: CHI TIẾT SẢN PHẨM ================== */}
                <div className="details-section">
                    <div>
                        <h1 className="product-title">{product.name}</h1>
                        <p className="product-subtitle">{product.brand || "Shoes"}</p>
                        <p className="product-price">
                            {product.finalPrice ? product.finalPrice.toLocaleString('vi-VN') : 0}₫
                        </p>
                    </div>

                    <div className="colors">
                        {product.variants?.map((variant, index) => {
                            // Lấy ảnh đầu tiên của từng Variant để làm nút chọn màu
                            const firstImgOfVariant = variant.images?.[0]?.imageUrl;
                            const displayImg = firstImgOfVariant?.startsWith("http")
                                ? firstImgOfVariant
                                : `http://localhost:8080${firstImgOfVariant}`;

                            return (
                                <img
                                    key={variant.id}
                                    src={displayImg || "https://via.placeholder.com/600"}
                                    alt="variant-color"
                                    className={selectedVariantIndex === index ? 'active-variant' : ''}
                                    onClick={() => handleVariantChange(index)}
                                    title={variant.color} // Hiện tên màu khi di chuột vào
                                />
                            );
                        })}
                    </div>

                    <div className="size-section">
                        <div className="size-header">
                            <span className="size-header-text">Select Size</span>

                            <div className="size-header-guide">
                                <span className="material-symbols-outlined">
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
                            <span className="material-symbols-outlined">
                                favorite
                            </span>
                        </button>
                    </div>

                    {/* ===================== Phần thông tin sản phẩm ================= */}
                    <div className="details-information">
                        <div className="description-section">
                            <p className="description-text">
                                {product.description}
                            </p>
                            <div className="attribute">
                                <ul>
                                    <li>
                                        <p className="colour-shown">
                                            Colour Shown: {currentVariant?.color || "N/A"}
                                        </p>
                                    </li>
                                    <li>
                                        <p className="style">
                                            Style: {currentVariant?.sku || product.id}
                                        </p>
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

                    {/* ===================== Phần Reviews (Accordion) ================= */}
                    <div className="accordion-section">
                        <div
                            className="accordion-header"
                            onClick={() => setIsReviewsOpen(!isReviewsOpen)}
                        >
                            <h3>Reviews ({product.reviewCount || reviewStats.totalElements || 0})</h3>
                            <span
                                className="material-symbols-outlined"
                                style={{
                                    transform: isReviewsOpen ? 'rotate(180deg)' : 'rotate(0deg)',
                                    transition: 'transform 0.3s ease'
                                }}
                            >
                                expand_more
                            </span>
                        </div>

                        <div className={`accordion-content-wrapper ${isReviewsOpen ? 'open' : ''}`}>
                            <div className="accordion-content" style={{ paddingBottom: '20px' }}>

                                {/* --- Form gửi bình luận mới --- */}
                                <div className="review-form-container" style={{ marginBottom: '30px', padding: '15px', backgroundColor: '#f5f5f5', borderRadius: '8px' }}>
                                    <h4 style={{ margin: '0 0 10px 0' }}>Write a Review</h4>
                                    <form onSubmit={handleReviewSubmit}>
                                        <div style={{ marginBottom: '10px', display: 'flex', gap: '5px' }}>
                                            {[1, 2, 3, 4, 5].map(star => (
                                                <span
                                                    key={star}
                                                    className="material-symbols-outlined"
                                                    style={{
                                                        cursor: 'pointer',
                                                        color: '#faaf00',
                                                        fontVariationSettings: `'FILL' ${star <= newReview.rating ? 1 : 0}`
                                                    }}
                                                    onClick={() => setNewReview({ ...newReview, rating: star })}
                                                >
                                                    star
                                                </span>
                                            ))}
                                        </div>
                                        <textarea
                                            style={{ width: '100%', minHeight: '80px', padding: '10px', marginBottom: '10px', borderRadius: '4px', border: '1px solid #ccc', resize: 'vertical' }}
                                            placeholder="How did you like this product?"
                                            value={newReview.comment}
                                            onChange={(e) => setNewReview({ ...newReview, comment: e.target.value })}
                                        />
                                        <button
                                            type="submit"
                                            className="btn btn-add"
                                            style={{ padding: '8px 16px', width: 'auto' }}
                                            disabled={isSubmitting}
                                        >
                                            {isSubmitting ? 'Submitting...' : 'Submit Review'}
                                        </button>
                                    </form>
                                </div>

                                {/* --- Danh sách hiển thị bình luận khách hàng --- */}
                                <div className="reviews-list">
                                    {reviews.length === 0 ? (
                                        <p style={{ color: '#757575' }}>No reviews yet. Be the first to review!</p>
                                    ) : (
                                        reviews.map(review => (
                                            <div key={review.id} className="review-item" style={{ borderBottom: '1px solid #eee', paddingBottom: '15px', marginBottom: '15px' }}>
                                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px' }}>
                                                    <strong>{review.username}</strong>
                                                    <span style={{ color: '#757575', fontSize: '12px' }}>
                                                        {new Date(review.createdAt).toLocaleDateString('vi-VN')}
                                                    </span>
                                                </div>
                                                <div style={{ color: '#faaf00', display: 'flex', marginBottom: '5px' }}>
                                                    {[1, 2, 3, 4, 5].map(star => (
                                                        <span key={star} className="material-symbols-outlined" style={{ fontSize: '16px', fontVariationSettings: `'FILL' ${star <= review.rating ? 1 : 0}` }}>
                                                            star
                                                        </span>
                                                    ))}
                                                </div>
                                                <p style={{ margin: 0, fontSize: '14px', color: '#111' }}>{review.comment}</p>
                                            </div>
                                        ))
                                    )}
                                </div>

                                {/* --- Nút Phân trang của mục Review --- */}
                                {reviewStats.totalPages > 1 && (
                                    <div className="review-pagination" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '10px', marginTop: '20px' }}>
                                        <button
                                            disabled={currentPage === 0}
                                            onClick={() => setCurrentPage(prev => prev - 1)}
                                            style={{ padding: '5px 10px', cursor: currentPage === 0 ? 'not-allowed' : 'pointer', border: '1px solid #ccc', background: '#fff' }}
                                        >
                                            Prev
                                        </button>
                                        <span style={{ fontSize: '14px' }}>Page {currentPage + 1} of {reviewStats.totalPages}</span>
                                        <button
                                            disabled={currentPage === reviewStats.totalPages - 1}
                                            onClick={() => setCurrentPage(prev => prev + 1)}
                                            style={{ padding: '5px 10px', cursor: currentPage === reviewStats.totalPages - 1 ? 'not-allowed' : 'pointer', border: '1px solid #ccc', background: '#fff' }}
                                        >
                                            Next
                                        </button>
                                    </div>
                                )}
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