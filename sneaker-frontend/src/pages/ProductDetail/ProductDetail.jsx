import React, { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import './ProductDetail.css'

import { useProductDetail } from "../../components/hooks/useProductDetail";
import { useCart } from "../../context/CartContext";
import { addToCart } from "../../services/cartService";
import { isAuthenticated } from "../../components/utils/auth";
import { getApiErrorMessage } from "../../services/apiError";
import { addWishlistItem, checkWishlistItem, removeWishlistItem } from "../../services/wishlistService";

function ProductDetail() {
    // Lấy id từ trên thanh URL xuống
    const { id } = useParams();
    const navigate = useNavigate();
    const location = useLocation();
    const { fetchCartCount } = useCart();

    const {
        product,
        loading,
        error,
        reviews,
        reviewStats,
        reviewSummary,
        canReview,
        currentPage,
        setCurrentPage,
        isSubmitting,
        addReview
    } = useProductDetail(id);

    // Quản lý xem đang xem màu (variant) thứ mấy
    const [selectedVariantIndex, setSelectedVariantIndex] = useState(0);
    const [selectedSize, setSelectedSize] = useState(null);
    const [cartStatus, setCartStatus] = useState({ type: "", message: "" });
    const [isAddingToCart, setIsAddingToCart] = useState(false);
    const [isFavorite, setIsFavorite] = useState(false);
    const [isFavoriteLoading, setIsFavoriteLoading] = useState(false);
    // State lưu vị trí ảnh đang được chọn (mặc định là 0 - ảnh đầu tiên)
    const [currentIndex, setCurrentIndex] = useState(0);

    // State quản lý việc đóng/mở phần Delivery và Reviews (mặc định là đóng - false)
    const [isDeliveryOpen, setIsDeliveryOpen] = useState(false);
    const [isReviewsOpen, setIsReviewsOpen] = useState(false);

    // State cho Form gửi đánh giá
    const [newReview, setNewReview] = useState({ rating: 5, comment: "" });

    useEffect(() => {
        let active = true;

        const loadFavorite = async () => {
            if (!isAuthenticated() || !id) return;
            try {
                const res = await checkWishlistItem(id);
                if (active) setIsFavorite(Boolean(res.data?.favorited));
            } catch {
                if (active) setIsFavorite(false);
            }
        };

        loadFavorite();
        return () => {
            active = false;
        };
    }, [id]);

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

    if (error) {
        return <h2>{error}</h2>;
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
    const originalPrice = product.price || 0;
    const finalPrice = product.finalPrice ?? originalPrice;
    const onSale = product.onSale || finalPrice < originalPrice;
    const discountPercent = product.discountPercent || 0;

    // Hàm đổi màu (đổi Variant)
    const handleVariantChange = (index) => {
        setSelectedVariantIndex(index);
        setSelectedSize(null);
        setCartStatus({ type: "", message: "" });
        setCurrentIndex(0); // Reset về ảnh đầu tiên của màu mới
    };

    // Hàm xử lí tô màu sao đánh giá
    const handleAddToBag = async () => {
        if (!isAuthenticated()) {
            navigate("/login", { state: { from: location } });
            return;
        }

        if (!selectedSize) {
            setCartStatus({ type: "error", message: "Please select a size first." });
            return;
        }

        setIsAddingToCart(true);
        setCartStatus({ type: "", message: "" });

        try {
            await addToCart({ variantSizeId: selectedSize.id, quantity: 1 });
            await fetchCartCount();
            setCartStatus({ type: "success", message: "Added to bag." });
        } catch (err) {
            const message = getApiErrorMessage(err, "Could not add this product to bag.");
            setCartStatus({ type: "error", message });
        } finally {
            setIsAddingToCart(false);
        }
    };

    const handleToggleFavorite = async () => {
        if (!isAuthenticated()) {
            navigate("/login", { state: { from: location } });
            return;
        }

        setIsFavoriteLoading(true);
        try {
            if (isFavorite) {
                await removeWishlistItem(product.id);
                setIsFavorite(false);
            } else {
                await addWishlistItem(product.id);
                setIsFavorite(true);
            }
        } catch (err) {
            setCartStatus({ type: "error", message: getApiErrorMessage(err, "Không thể cập nhật yêu thích.") });
        } finally {
            setIsFavoriteLoading(false);
        }
    };

    const renderStars = (rating) => {
        // Ép về số float an toàn, nếu null/undefined thì gán bằng 0
        const currentRating = parseFloat(rating || 0);

        return Array.from({ length: 5 }, (_, index) => {
            const starValue = index + 1; // Vị trí ngôi sao (1, 2, 3, 4, 5)
            let fillPercent = 0;
            const decimal = currentRating - (starValue - 1);
            fillPercent = decimal * 100;

            return (
                <div
                    key={index}
                    style={{
                        position: 'relative',
                        display: 'inline-block',
                        width: '20px',
                        height: '20px',
                        marginRight: '2px',
                        marginBottom: '2px',
                        verticalAlign: 'middle'
                    }}
                >
                    {/* LỚP NỀN: Ngôi sao rỗng màu xám */}
                    <span
                        className="material-symbols-outlined"
                        style={{
                            color: '#ffd814',
                            fontSize: '20px',
                            position: 'absolute',
                            left: 0,
                            top: 0
                        }}
                    >
                        star
                    </span>

                    {/* LỚP ĐÈ: Ngôi sao vàng đặc bị cắt theo tỷ lệ phần trăm */}
                    <div
                        style={{
                            position: 'absolute',
                            left: 0,
                            top: 0,
                            width: `${fillPercent}%`,
                            overflow: 'hidden',
                            height: '100%'
                        }}
                    >
                        <span
                            className="material-symbols-outlined"
                            style={{
                                color: '#ffd814',
                                fontSize: '20px',
                                fontVariationSettings: "'FILL' 1, 'wght' 400",
                                display: 'block',
                                width: '20px'
                            }}
                        >
                            star
                        </span>
                    </div>
                </div>
            );
        });
    };

    return (
        <div className="product-detail-container">
            <div className="product-detail">

                {/* =================== CỘT TRÁI: DANH SÁCH HÌNH ẢNH SẢN PHẨM ================ */}
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
                        <div className={`product-price-block ${onSale ? 'sale' : ''}`}>
                            {onSale && (
                                <span className="detail-sale-badge">
                                    {discountPercent > 0 ? `-${discountPercent}%` : 'SALE'}
                                </span>
                            )}
                            <p className="product-price">
                                {finalPrice.toLocaleString('vi-VN')}₫
                            </p>
                            {onSale && (
                                <p className="product-original-price">
                                    {originalPrice.toLocaleString('vi-VN')}₫
                                </p>
                            )}
                        </div>
                        <p className="product-price legacy-price-hidden">
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
                            {currentVariant?.sizes?.length ? (
                                currentVariant.sizes.map(size => {
                                    const isOutOfStock = size.quantity <= 0;
                                    const isSelected = selectedSize?.id === size.id;

                                    return (
                                        <button
                                            key={size.id}
                                            type="button"
                                            className={`size-box ${isSelected ? "selected" : ""} ${isOutOfStock ? "disabled" : ""}`}
                                            disabled={isOutOfStock}
                                            onClick={() => {
                                                setSelectedSize(size);
                                                setCartStatus({ type: "", message: "" });
                                            }}
                                        >
                                            EU {size.sizeValue}
                                        </button>
                                    );
                                })
                            ) : (
                                <p className="size-empty">No sizes available</p>
                            )}
                        </div>
                    </div>

                    <div className="action-buttons">
                        <button
                            className="btn btn-add"
                            type="button"
                            onClick={handleAddToBag}
                            disabled={isAddingToCart}
                        >
                            {isAddingToCart ? "Adding..." : "Add to Bag"}
                        </button>
                        <button
                            className={`btn btn-fav ${isFavorite ? "active" : ""}`}
                            type="button"
                            onClick={handleToggleFavorite}
                            disabled={isFavoriteLoading}
                        >
                            {isFavorite ? "Favorited" : "Favourite"}
                            <span className="material-symbols-outlined">
                                favorite
                            </span>
                        </button>
                    </div>
                    {cartStatus.message && (
                        <p className={`cart-status ${cartStatus.type}`}>
                            {cartStatus.message}
                        </p>
                    )}

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
                    <div className="accordion-section reviews-section">
                        <div
                            className="accordion-header"
                            onClick={() => setIsReviewsOpen(!isReviewsOpen)}
                        >
                            <h3>Reviews ({reviewSummary.totalReviews || product.reviewCount || reviewStats.totalElements || 0})</h3>

                            <div className="accordion-right-group">
                                <div className="header-stars-preview">
                                    {renderStars(reviewSummary.averageRating || product?.averageRating)}
                                </div>
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
                        </div>

                        <div className={`accordion-content-wrapper ${isReviewsOpen ? 'open' : ''}`}>
                            <div className="accordion-content">

                                {/* --- Danh sách hiển thị bình luận khách hàng --- */}
                                <div className="reviews-list">
                                    {reviews.length === 0 ? (
                                        <p className="no-reviews">No reviews yet. Be the first to review!</p>
                                    ) : (
                                        reviews.map(review => (
                                            <div key={review.id} className="review-item">
                                                {/* Hàng chứa: Sao -> Tên -> Ngày tháng */}
                                                <div className="review-meta-row">
                                                    <div className="item-stars">
                                                        {renderStars(review?.rating)}
                                                    </div>
                                                    <span className="review-username">{review.username}</span>
                                                    <span className="review-divider">-</span>
                                                    <span className="review-date">
                                                        {new Date(review.createdAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
                                                    </span>
                                                </div>

                                                {/* Nội dung bình luận */}
                                                <p className="review-comment-content">{review.comment}</p>
                                            </div>
                                        ))
                                    )}
                                </div>

                                {/* ======== Các nút hành động dưới đáy (See Reviews & Write a review) ======== */}
                                <div className="review-write-box">
                                    {canReview.canReview ? (
                                        <form onSubmit={handleReviewSubmit} className="review-form">
                                            <label>
                                                <span>Rating</span>
                                                <select
                                                    value={newReview.rating}
                                                    onChange={(e) => setNewReview(prev => ({ ...prev, rating: Number(e.target.value) }))}
                                                >
                                                    {[5, 4, 3, 2, 1].map(value => (
                                                        <option key={value} value={value}>{value} sao</option>
                                                    ))}
                                                </select>
                                            </label>
                                            <label>
                                                <span>Nhận xét</span>
                                                <textarea
                                                    value={newReview.comment}
                                                    onChange={(e) => setNewReview(prev => ({ ...prev, comment: e.target.value }))}
                                                    maxLength={1000}
                                                    rows={4}
                                                    placeholder="Chia sẻ cảm nhận sau khi mua sản phẩm..."
                                                />
                                            </label>
                                            <button type="submit" className="btn-outline" disabled={isSubmitting}>
                                                {isSubmitting ? "Đang gửi..." : "Gửi đánh giá"}
                                            </button>
                                        </form>
                                    ) : (
                                        <p className="review-note">{canReview.message || "Bạn chỉ có thể đánh giá sau khi mua và nhận hàng."}</p>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div >
    );
}

export default ProductDetail;
