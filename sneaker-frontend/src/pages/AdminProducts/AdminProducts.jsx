import React, { useEffect, useMemo, useState } from 'react';
import { FiEdit2, FiPlus, FiRefreshCcw, FiSearch } from 'react-icons/fi';
import { getApiErrorMessage } from '../../services/apiError';
import {
    createAdminProduct,
    getAdminCategories,
    getAdminProducts,
    getSizes,
    updateAdminProduct,
    updateAdminProductStatus
} from '../../services/adminService';
import ProductForm from './components/ProductForm';
import './AdminProducts.css';

const filters = [
    { value: 'ALL', label: 'Tất cả' },
    { value: 'ACTIVE', label: 'Active' },
    { value: 'INACTIVE', label: 'Inactive' },
    { value: 'DISCOUNT', label: 'Có giảm giá' },
    { value: 'OUT_OF_STOCK', label: 'Hết hàng' }
];

const formatMoney = (value) => `${Number(value || 0).toLocaleString('vi-VN')}₫`;

function AdminProducts() {
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [sizes, setSizes] = useState([]);
    const [keyword, setKeyword] = useState('');
    const [filter, setFilter] = useState('ALL');
    const [editingProduct, setEditingProduct] = useState(null);
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [error, setError] = useState('');
    const [message, setMessage] = useState('');
    const [page, setPage] = useState(1);

    const pageSize = 8;
    const totalPages = Math.max(Math.ceil(products.length / pageSize), 1);
    const pagedProducts = useMemo(() => {
        const start = (page - 1) * pageSize;
        return products.slice(start, start + pageSize);
    }, [page, products]);

    const loadData = async () => {
        setIsLoading(true);
        setError('');

        try {
            const [productRes, categoryRes, sizeRes] = await Promise.all([
                getAdminProducts({ keyword: keyword.trim() || undefined, filter }),
                getAdminCategories(),
                getSizes()
            ]);
            setProducts(productRes.data || []);
            setCategories(categoryRes.data || []);
            setSizes(sizeRes.data || []);
            setPage(1);
        } catch (err) {
            setError(getApiErrorMessage(err, 'Không thể tải dữ liệu sản phẩm.'));
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        loadData();
    }, [filter]);

    const handleSearch = (e) => {
        e.preventDefault();
        loadData();
    };

    const openCreate = () => {
        setEditingProduct(null);
        setIsFormOpen(true);
        setError('');
        setMessage('');
    };

    const openEdit = (product) => {
        setEditingProduct(product);
        setIsFormOpen(true);
        setError('');
        setMessage('');
    };

    const handleSave = async (payload) => {
        setIsSaving(true);
        setError('');
        setMessage('');

        try {
            if (editingProduct?.id) {
                await updateAdminProduct(editingProduct.id, payload);
                setMessage('Cập nhật sản phẩm thành công.');
            } else {
                await createAdminProduct(payload);
                setMessage('Tạo sản phẩm thành công.');
            }
            setIsFormOpen(false);
            await loadData();
        } catch (err) {
            setError(getApiErrorMessage(err, 'Không thể lưu sản phẩm.'));
        } finally {
            setIsSaving(false);
        }
    };

    const handleToggleStatus = async (product) => {
        if (!window.confirm(`${product.active ? 'Ẩn' : 'Mở bán'} sản phẩm này?`)) return;

        try {
            await updateAdminProductStatus(product.id, !product.active);
            setMessage('Cập nhật trạng thái sản phẩm thành công.');
            await loadData();
        } catch (err) {
            setError(getApiErrorMessage(err, 'Không thể cập nhật trạng thái sản phẩm.'));
        }
    };

    return (
        <main className="admin-products-page">
            <div className="admin-page-heading">
                <div>
                    <h1>Quản lý sản phẩm</h1>
                    <p>Quản lý sản phẩm, variant, size tồn kho và ảnh URL.</p>
                </div>
                <button type="button" onClick={openCreate}><FiPlus /> Thêm sản phẩm</button>
            </div>

            {error && <div className="admin-alert error">{error}</div>}
            {message && <div className="admin-alert success">{message}</div>}

            <section className="admin-product-toolbar">
                <form onSubmit={handleSearch} className="admin-product-search">
                    <FiSearch />
                    <input
                        value={keyword}
                        onChange={(e) => setKeyword(e.target.value)}
                        placeholder="Tìm tên, brand, category..."
                    />
                    <button type="submit">Tìm</button>
                </form>
                <select value={filter} onChange={(e) => setFilter(e.target.value)}>
                    {filters.map(item => <option key={item.value} value={item.value}>{item.label}</option>)}
                </select>
                <button type="button" className="secondary-refresh" onClick={loadData}><FiRefreshCcw /> Làm mới</button>
            </section>

            <section className="admin-products-card">
                {isLoading && <div className="admin-empty">Đang tải sản phẩm...</div>}
                {!isLoading && products.length === 0 && <div className="admin-empty">Không có sản phẩm phù hợp.</div>}

                {!isLoading && products.length > 0 && (
                    <>
                        <div className="admin-products-table-wrap">
                            <table className="admin-products-table">
                                <thead>
                                    <tr>
                                        <th>Sản phẩm</th>
                                        <th>Brand</th>
                                        <th>Category</th>
                                        <th>Giá</th>
                                        <th>Stock</th>
                                        <th>Sale</th>
                                        <th>Status</th>
                                        <th></th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {pagedProducts.map(product => (
                                        <tr key={product.id}>
                                            <td>
                                                <strong>{product.name}</strong>
                                                <span>#{product.id}</span>
                                            </td>
                                            <td>{product.brand}</td>
                                            <td>{product.categoryName || 'N/A'}</td>
                                            <td>
                                                {product.onSale && <span className="old-price">{formatMoney(product.price)}</span>}
                                                <strong>{formatMoney(product.finalPrice || product.price)}</strong>
                                            </td>
                                            <td>
                                                <span className={product.outOfStock ? 'stock-empty' : 'stock-ok'}>
                                                    {product.totalStock || 0}
                                                </span>
                                            </td>
                                            <td>{product.onSale ? `-${product.discountPercent || 0}%` : 'Không'}</td>
                                            <td>
                                                <span className={`admin-badge ${product.active ? 'status-DELIVERED' : 'status-CANCELLED'}`}>
                                                    {product.active ? 'Active' : 'Inactive'}
                                                </span>
                                            </td>
                                            <td className="table-actions">
                                                <button type="button" onClick={() => openEdit(product)}><FiEdit2 /> Sửa</button>
                                                <button type="button" className="danger" onClick={() => handleToggleStatus(product)}>
                                                    {product.active ? 'Ẩn' : 'Mở'}
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        <div className="admin-pagination">
                            <button disabled={page <= 1} onClick={() => setPage(prev => prev - 1)}>Trước</button>
                            <span>Trang {page}/{totalPages}</span>
                            <button disabled={page >= totalPages} onClick={() => setPage(prev => prev + 1)}>Sau</button>
                        </div>
                    </>
                )}
            </section>

            {isFormOpen && (
                <ProductForm
                    product={editingProduct}
                    categories={categories}
                    sizes={sizes}
                    onClose={() => setIsFormOpen(false)}
                    onSubmit={handleSave}
                    isSaving={isSaving}
                />
            )}
        </main>
    );
}

export default AdminProducts;
