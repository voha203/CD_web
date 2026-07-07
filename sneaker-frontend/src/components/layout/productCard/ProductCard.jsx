import React, { useEffect, useState } from "react";
import { Link, useNavigate } from 'react-router-dom';
import './ProductCard.css';
import { isAuthenticated } from "../../utils/auth";
import { addWishlistItem, checkWishlistItem, removeWishlistItem } from "../../../services/wishlistService";

function ProductCard({ product }) {
    const navigate = useNavigate();
    const [isFavorite, setIsFavorite] = useState(false);
    const [isFavoriteLoading, setIsFavoriteLoading] = useState(false);

    const formatPrice = (price) => {
        return new Intl.NumberFormat('vi-VN', {
            style: 'currency',
            currency: 'VND'
        }).format(price);
    };

    // Lấy mảng images từ Variant đầu tiên (nếu có)
    const firstVariantImages = product.variants && product.variants.length > 0
        ? product.variants[0].images
        : [];

    // Tìm ảnh có isMain = true (1), nếu không có thì lấy ảnh đầu tiên
    const mainImage =
        firstVariantImages.find(img => img.isMain)?.imageUrl ||
        firstVariantImages[0]?.imageUrl ||
        "https://via.placeholder.com/300";
    const originalPrice = product.price || 0;
    const finalPrice = product.finalPrice ?? originalPrice;
    const onSale = product.onSale || finalPrice < originalPrice;
    const discountPercent = product.discountPercent || 0;
    const rating = product.averageRating || product.rating;
    const reviewCount = product.reviewCount || product.totalReviews;

    useEffect(() => {
        let active = true;

        const loadFavorite = async () => {
            if (!isAuthenticated() || !product?.id) return;
            try {
                const res = await checkWishlistItem(product.id);
                if (active) setIsFavorite(Boolean(res.data?.favorited));
            } catch {
                if (active) setIsFavorite(false);
            }
        };

        loadFavorite();
        return () => {
            active = false;
        };
    }, [product?.id]);

    const handleFavoriteClick = async (event) => {
        event.preventDefault();
        event.stopPropagation();

        if (!isAuthenticated()) {
            navigate("/login");
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
        } finally {
            setIsFavoriteLoading(false);
        }
    };

    return (
        <Link to={`/products/${product.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
            <div className="product-card">

                {/* 1. KHỐI HÌNH ẢNH (Chứa Badges và Hiệu ứng Hover) */}
                <div className="card-image-wrapper">

                    {/* Render Badges nếu có dữ liệu */}
                    {product.isNew && <span className="badge badge-new">New</span>}
                    {onSale && (
                        <span className="badge badge-sale">
                            {discountPercent > 0 ? `-${discountPercent}%` : 'SALE'}
                        </span>
                    )}

                    {/* Ảnh giày chính */}
                    <button
                        type="button"
                        className={`product-favorite-btn ${isFavorite ? "active" : ""}`}
                        onClick={handleFavoriteClick}
                        disabled={isFavoriteLoading}
                        aria-label={isFavorite ? "Bỏ yêu thích" : "Thêm yêu thích"}
                    >
                        ♥
                    </button>
                    <img
                        src={mainImage}
                        alt={product.name}
                        className="product-image"
                    />
                </div>

                {/* 2. KHỐI THÔNG TIN SẢN PHẨM (Nằm dưới ảnh) */}
                <div className="card-details">
                    {/* Hiển thị thương hiệu nếu có */}
                    <div className="product-meta-row">
                        {product.brand && <span className="product-brand">{product.brand}</span>}
                        {product.categoryName && <span className="product-category">{product.categoryName}</span>}
                    </div>

                    {/* Tên giày */}
                    <h3 className="product-name" title={product.name}>
                        {product.name}
                    </h3>

                    {rating && (
                        <div className="product-rating" aria-label={`Đánh giá ${rating} sao`}>
                            <span>★</span>
                            <strong>{Number(rating).toFixed(1)}</strong>
                            {reviewCount ? <small>({reviewCount})</small> : null}
                        </div>
                    )}

                    {/* Khối hiển thị giá */}
                    <div className={`price-row ${onSale ? 'sale' : ''}`}>
                        <span className="current-price">
                            {formatPrice(finalPrice)}
                        </span>

                        {/* Hiện giá cũ (bị gạch) nếu đang sale */}
                        {onSale && (
                            <span className="old-price">
                                {formatPrice(originalPrice)}
                            </span>
                        )}
                    </div>
                </div>
            </div>
        </Link>
    );
}

export default ProductCard;
