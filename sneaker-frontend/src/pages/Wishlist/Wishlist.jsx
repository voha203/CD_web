import React, { useEffect, useState } from 'react';
import ProductCard from '../../components/layout/productCard/ProductCard';
import { getWishlist, removeWishlistItem } from '../../services/wishlistService';
import { getApiErrorMessage } from '../../services/apiError';
import './Wishlist.css';

function Wishlist() {
    const [items, setItems] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isRemoving, setIsRemoving] = useState(null);
    const [error, setError] = useState('');

    const loadWishlist = async () => {
        setIsLoading(true);
        setError('');

        try {
            const res = await getWishlist();
            setItems(res.data || []);
        } catch (err) {
            setError(getApiErrorMessage(err, 'Không thể tải danh sách yêu thích.'));
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        loadWishlist();
    }, []);

    const handleRemove = async (productId) => {
        setIsRemoving(productId);
        setError('');

        try {
            await removeWishlistItem(productId);
            setItems(prev => prev.filter(item => item.productId !== productId));
        } catch (err) {
            setError(getApiErrorMessage(err, 'Không thể xóa sản phẩm khỏi yêu thích.'));
        } finally {
            setIsRemoving(null);
        }
    };

    return (
        <main className="wishlist-page">
            <div className="wishlist-header">
                <div>
                    <h1>Sản phẩm yêu thích</h1>
                    <p>Lưu lại những đôi sneaker bạn muốn xem lại hoặc mua sau.</p>
                </div>
                <span>{items.length} sản phẩm</span>
            </div>

            {error && <div className="wishlist-alert">{error}</div>}
            {isLoading && <div className="wishlist-empty">Đang tải danh sách yêu thích...</div>}
            {!isLoading && items.length === 0 && (
                <div className="wishlist-empty">Bạn chưa yêu thích sản phẩm nào.</div>
            )}

            {!isLoading && items.length > 0 && (
                <div className="wishlist-grid">
                    {items.map(item => (
                        <div key={item.id} className="wishlist-item">
                            <ProductCard product={item.product} />
                            <button
                                type="button"
                                onClick={() => handleRemove(item.productId)}
                                disabled={isRemoving === item.productId}
                            >
                                {isRemoving === item.productId ? 'Đang xóa...' : 'Xóa khỏi yêu thích'}
                            </button>
                        </div>
                    ))}
                </div>
            )}
        </main>
    );
}

export default Wishlist;
