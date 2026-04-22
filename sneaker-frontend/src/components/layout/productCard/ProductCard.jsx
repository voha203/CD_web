import React from 'react';
import './ProductCard.css';

function ProductCard({ product }) {

    const formatPrice = (price) => {
        return new Intl.NumberFormat('vi-VN', {
            style: 'currency',
            currency: 'VND'
        }).format(price);
    };

    return (
        <div className="product-card">

            {/* 1. KHỐI HÌNH ẢNH (Chứa Badges và Hiệu ứng Hover) */}
            <div className="card-image-wrapper">

                {/* Render Badges nếu có dữ liệu */}
                {product.isNew && <span className="badge badge-new">New</span>}
                {product.salePercentage > 0 && (
                    <span className="badge badge-sale">-${product.salePercentage}%</span>
                )}

                {/* Ảnh giày chính */}
                <img
                    src={product.imageUrl}
                    alt={product.name}
                    className="product-image"
                />
            </div>

            {/* 2. KHỐI THÔNG TIN SẢN PHẨM (Nằm dưới ảnh) */}
            <div className="card-details">
                {/* Hiển thị thương hiệu nếu có */}
                {product.brand && <span className="product-brand">{product.brand}</span>}

                {/* Tên giày */}
                <h3 className="product-name" title={product.name}>
                    {product.name}
                </h3>

                {/* Khối hiển thị giá */}
                <div className="price-row">
                    <span className="current-price">
                        {formatPrice(product.price)}
                    </span>

                    {/* Hiện giá cũ (bị gạch) nếu đang sale */}
                    {product.oldPrice && (
                        <span className="old-price">
                            {formatPrice(product.oldPrice)}
                        </span>
                    )}
                </div>

                {/* Nút Add to Cart */}
                <button className="cart-btn">
                    Add to cart
                </button>
            </div>

        </div>
    );
}

export default ProductCard;