import React, { useEffect, useMemo, useState } from 'react';
import { getProducts } from '../../services/api';
import { getApiErrorMessage } from '../../services/apiError';
import {
    createAdminDiscount,
    deleteAdminDiscount,
    getAdminDiscounts,
    toggleAdminDiscount,
    updateAdminDiscount
} from '../../services/discountService';
import './AdminDiscounts.css';

const emptyForm = {
    name: '',
    productId: '',
    type: 'PERCENT',
    value: '',
    startDate: '',
    endDate: '',
    active: true
};

const toInputDateTime = (value) => {
    if (!value) return '';
    return value.slice(0, 16);
};

const formatMoney = (value) => {
    const number = Number(value || 0);
    return `${number.toLocaleString('vi-VN')}₫`;
};

const formatDateTime = (value) => {
    if (!value) return 'Chưa đặt';
    return new Date(value).toLocaleString('vi-VN');
};

const getDiscountText = (discount) => {
    if (discount.type === 'PERCENT') return `${discount.value}%`;
    return formatMoney(discount.value);
};

const normalizeList = (data) => {
    if (Array.isArray(data)) return data;
    if (Array.isArray(data?.content)) return data.content;
    return [];
};

const toPayload = (form) => ({
    name: form.name.trim(),
    productId: Number(form.productId),
    type: form.type,
    value: Number(form.value),
    startDate: form.startDate || null,
    endDate: form.endDate || null,
    active: Boolean(form.active)
});

function AdminDiscounts() {
    const [discounts, setDiscounts] = useState([]);
    const [products, setProducts] = useState([]);
    const [form, setForm] = useState(emptyForm);
    const [editingId, setEditingId] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [error, setError] = useState('');
    const [message, setMessage] = useState('');

    const sortedDiscounts = useMemo(() => {
        return [...discounts].sort((a, b) => (b.id || 0) - (a.id || 0));
    }, [discounts]);

    const fetchData = async () => {
        setIsLoading(true);
        setError('');

        try {
            const [discountRes, productData] = await Promise.all([
                getAdminDiscounts(),
                getProducts()
            ]);

            setDiscounts(normalizeList(discountRes.data));
            setProducts(normalizeList(productData));
        } catch (err) {
            setError(getApiErrorMessage(err, 'Không thể tải dữ liệu giảm giá sản phẩm.'));
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setForm(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
        setError('');
        setMessage('');
    };

    const resetForm = () => {
        setForm(emptyForm);
        setEditingId(null);
        setError('');
        setMessage('');
    };

    const validateForm = () => {
        if (!form.name.trim()) return 'Vui lòng nhập tên chương trình giảm giá.';
        if (!form.productId) return 'Vui lòng chọn sản phẩm áp dụng.';
        if (form.value === '' || Number(form.value) <= 0) return 'Giá trị giảm phải lớn hơn 0.';
        if (form.type === 'PERCENT' && Number(form.value) > 100) return 'Giảm theo phần trăm không được vượt quá 100%.';
        if (form.startDate && form.endDate && new Date(form.endDate) <= new Date(form.startDate)) {
            return 'Ngày kết thúc phải sau ngày bắt đầu.';
        }
        return '';
    };

    const handleEdit = (discount) => {
        setEditingId(discount.id);
        setForm({
            name: discount.name || '',
            productId: discount.productId ? String(discount.productId) : '',
            type: discount.type || 'PERCENT',
            value: discount.value ?? '',
            startDate: toInputDateTime(discount.startDate),
            endDate: toInputDateTime(discount.endDate),
            active: Boolean(discount.active)
        });
        setMessage('');
        setError('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const validationMessage = validateForm();

        if (validationMessage) {
            setError(validationMessage);
            return;
        }

        setIsSaving(true);
        setError('');
        setMessage('');

        try {
            const payload = toPayload(form);

            if (editingId) {
                await updateAdminDiscount(editingId, payload);
                setMessage('Cập nhật chương trình giảm giá thành công.');
            } else {
                await createAdminDiscount(payload);
                setMessage('Tạo chương trình giảm giá thành công.');
            }

            resetForm();
            await fetchData();
        } catch (err) {
            setError(getApiErrorMessage(err, 'Không thể lưu chương trình giảm giá.'));
        } finally {
            setIsSaving(false);
        }
    };

    const handleToggle = async (id) => {
        setError('');
        setMessage('');

        try {
            await toggleAdminDiscount(id);
            setMessage('Cập nhật trạng thái giảm giá thành công.');
            await fetchData();
        } catch (err) {
            setError(getApiErrorMessage(err, 'Không thể bật/tắt chương trình giảm giá.'));
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Xóa chương trình giảm giá này?')) return;

        setError('');
        setMessage('');

        try {
            await deleteAdminDiscount(id);
            setMessage('Xóa chương trình giảm giá thành công.');
            if (editingId === id) resetForm();
            await fetchData();
        } catch (err) {
            setError(getApiErrorMessage(err, 'Không thể xóa chương trình giảm giá.'));
        }
    };

    return (
        <main className="admin-discounts-page">
            <section className="admin-discounts-header">
                <div>
                    <h1>Quản lý giảm giá sản phẩm</h1>
                    <p>Tạo flash sale hoặc giảm giá trực tiếp trên từng sản phẩm.</p>
                </div>
                <span className="discount-count">{discounts.length} chương trình</span>
            </section>

            <section className="admin-discounts-grid">
                <form className="discount-form" onSubmit={handleSubmit}>
                    <h2>{editingId ? 'Sửa giảm giá' : 'Thêm giảm giá'}</h2>

                    <label>
                        <span>Tên chương trình</span>
                        <input
                            name="name"
                            value={form.name}
                            onChange={handleChange}
                            placeholder="Flash Sale cuối tuần"
                        />
                    </label>

                    <label>
                        <span>Sản phẩm áp dụng</span>
                        <select name="productId" value={form.productId} onChange={handleChange}>
                            <option value="">Chọn sản phẩm</option>
                            {products.map(product => (
                                <option key={product.id} value={product.id}>
                                    {product.name}
                                </option>
                            ))}
                        </select>
                    </label>

                    <div className="discount-form-row">
                        <label>
                            <span>Loại giảm</span>
                            <select name="type" value={form.type} onChange={handleChange}>
                                <option value="PERCENT">Phần trăm</option>
                                <option value="FIXED">Số tiền cố định</option>
                            </select>
                        </label>

                        <label>
                            <span>Giá trị</span>
                            <input
                                name="value"
                                type="number"
                                min="0"
                                max={form.type === 'PERCENT' ? '100' : undefined}
                                step={form.type === 'PERCENT' ? '1' : '1000'}
                                value={form.value}
                                onChange={handleChange}
                                placeholder={form.type === 'PERCENT' ? '10' : '50000'}
                            />
                        </label>
                    </div>

                    <div className="discount-form-row">
                        <label>
                            <span>Bắt đầu</span>
                            <input name="startDate" type="datetime-local" value={form.startDate} onChange={handleChange} />
                        </label>

                        <label>
                            <span>Kết thúc</span>
                            <input name="endDate" type="datetime-local" value={form.endDate} onChange={handleChange} />
                        </label>
                    </div>

                    <label className="discount-checkbox">
                        <input name="active" type="checkbox" checked={form.active} onChange={handleChange} />
                        <span>Đang hoạt động</span>
                    </label>

                    {error && <p className="discount-error">{error}</p>}
                    {message && <p className="discount-success">{message}</p>}

                    <div className="discount-form-actions">
                        <button type="submit" disabled={isSaving}>
                            {isSaving ? 'Đang lưu...' : editingId ? 'Cập nhật' : 'Tạo giảm giá'}
                        </button>
                        {editingId && (
                            <button type="button" className="secondary" onClick={resetForm}>
                                Hủy sửa
                            </button>
                        )}
                    </div>
                </form>

                <section className="discount-list-panel">
                    <h2>Danh sách giảm giá</h2>

                    {isLoading && <div className="discount-empty">Đang tải...</div>}
                    {!isLoading && sortedDiscounts.length === 0 && (
                        <div className="discount-empty">Chưa có chương trình giảm giá nào.</div>
                    )}

                    {!isLoading && sortedDiscounts.length > 0 && (
                        <div className="discount-table-wrapper">
                            <table className="discount-table">
                                <thead>
                                    <tr>
                                        <th>Chương trình</th>
                                        <th>Sản phẩm</th>
                                        <th>Giảm</th>
                                        <th>Giá sau giảm</th>
                                        <th>Thời gian</th>
                                        <th>Trạng thái</th>
                                        <th></th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {sortedDiscounts.map(discount => (
                                        <tr key={discount.id}>
                                            <td>
                                                <strong>{discount.name}</strong>
                                                <span>#{discount.id}</span>
                                            </td>
                                            <td>{discount.productName || `SP ${discount.productId}`}</td>
                                            <td>{getDiscountText(discount)}</td>
                                            <td>
                                                {discount.originalPrice != null && discount.finalPrice != null ? (
                                                    <>
                                                        <span className="discount-old-price">{formatMoney(discount.originalPrice)}</span>
                                                        <strong className="discount-sale-price">{formatMoney(discount.finalPrice)}</strong>
                                                    </>
                                                ) : (
                                                    'Đang cập nhật'
                                                )}
                                            </td>
                                            <td>
                                                <span>{formatDateTime(discount.startDate)}</span>
                                                <span>{formatDateTime(discount.endDate)}</span>
                                            </td>
                                            <td>
                                                <span className={`discount-status ${discount.active ? 'active' : 'inactive'}`}>
                                                    {discount.active ? 'Đang bật' : 'Đã tắt'}
                                                </span>
                                            </td>
                                            <td className="discount-actions">
                                                <button type="button" onClick={() => handleEdit(discount)}>Sửa</button>
                                                <button type="button" onClick={() => handleToggle(discount.id)}>
                                                    {discount.active ? 'Tắt' : 'Bật'}
                                                </button>
                                                <button type="button" className="danger" onClick={() => handleDelete(discount.id)}>Xóa</button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </section>
            </section>
        </main>
    );
}

export default AdminDiscounts;
