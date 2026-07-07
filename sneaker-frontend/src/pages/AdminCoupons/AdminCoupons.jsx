import React, { useEffect, useMemo, useState } from 'react';
import {
    createAdminCoupon,
    deleteAdminCoupon,
    getAdminCoupons,
    toggleAdminCoupon,
    updateAdminCoupon
} from '../../services/couponService';
import { getApiErrorMessage } from '../../services/apiError';
import './AdminCoupons.css';

const emptyForm = {
    code: '',
    name: '',
    description: '',
    discountType: 'PERCENT',
    discountValue: '',
    minOrderAmount: '',
    maxDiscountAmount: '',
    startDate: '',
    endDate: '',
    usageLimit: '',
    active: true
};

const toInputDateTime = (value) => {
    if (!value) return '';
    return value.slice(0, 16);
};

const toPayload = (form) => ({
    code: form.code.trim().toUpperCase(),
    name: form.name.trim(),
    description: form.description?.trim() || '',
    discountType: form.discountType,
    discountValue: Number(form.discountValue),
    minOrderAmount: form.minOrderAmount === '' ? 0 : Number(form.minOrderAmount),
    maxDiscountAmount: form.maxDiscountAmount === '' ? null : Number(form.maxDiscountAmount),
    startDate: form.startDate || null,
    endDate: form.endDate || null,
    usageLimit: form.usageLimit === '' ? null : Number(form.usageLimit),
    active: Boolean(form.active)
});

function AdminCoupons() {
    const [coupons, setCoupons] = useState([]);
    const [form, setForm] = useState(emptyForm);
    const [editingId, setEditingId] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [error, setError] = useState('');
    const [message, setMessage] = useState('');

    const sortedCoupons = useMemo(() => {
        return [...coupons].sort((a, b) => (b.id || 0) - (a.id || 0));
    }, [coupons]);

    const fetchCoupons = async () => {
        setIsLoading(true);
        setError('');

        try {
            const res = await getAdminCoupons();
            setCoupons(res.data || []);
        } catch (err) {
            setError(getApiErrorMessage(err, 'Không thể tải danh sách mã giảm giá.'));
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchCoupons();
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

    const handleEdit = (coupon) => {
        setEditingId(coupon.id);
        setForm({
            code: coupon.code || '',
            name: coupon.name || '',
            description: coupon.description || '',
            discountType: coupon.discountType || 'PERCENT',
            discountValue: coupon.discountValue ?? '',
            minOrderAmount: coupon.minOrderAmount ?? '',
            maxDiscountAmount: coupon.maxDiscountAmount ?? '',
            startDate: toInputDateTime(coupon.startDate),
            endDate: toInputDateTime(coupon.endDate),
            usageLimit: coupon.usageLimit ?? '',
            active: coupon.active
        });
        setMessage('');
        setError('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSaving(true);
        setError('');
        setMessage('');

        try {
            const payload = toPayload(form);

            if (editingId) {
                await updateAdminCoupon(editingId, payload);
                setMessage('Cập nhật mã giảm giá thành công.');
            } else {
                await createAdminCoupon(payload);
                setMessage('Tạo mã giảm giá thành công.');
            }

            resetForm();
            await fetchCoupons();
        } catch (err) {
            setError(getApiErrorMessage(err, 'Không thể lưu mã giảm giá.'));
        } finally {
            setIsSaving(false);
        }
    };

    const handleToggle = async (id) => {
        try {
            await toggleAdminCoupon(id);
            await fetchCoupons();
        } catch (err) {
            setError(getApiErrorMessage(err, 'Không thể bật/tắt mã giảm giá.'));
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Xóa mã giảm giá này?')) return;

        try {
            await deleteAdminCoupon(id);
            await fetchCoupons();
        } catch (err) {
            setError(getApiErrorMessage(err, 'Không thể xóa mã giảm giá.'));
        }
    };

    return (
        <main className="admin-coupons-page">
            <section className="admin-coupons-header">
                <h1>Quản lý mã giảm giá</h1>
                <p>Tạo và theo dõi coupon dùng tại checkout.</p>
            </section>

            <section className="admin-coupons-grid">
                <form className="coupon-form" onSubmit={handleSubmit}>
                    <h2>{editingId ? 'Sửa mã giảm giá' : 'Thêm mã giảm giá'}</h2>

                    <label>
                        <span>Mã</span>
                        <input name="code" value={form.code} onChange={handleChange} placeholder="SALE10" />
                    </label>

                    <label>
                        <span>Tên</span>
                        <input name="name" value={form.name} onChange={handleChange} placeholder="Giảm 10%" />
                    </label>

                    <label>
                        <span>Mô tả</span>
                        <textarea name="description" value={form.description} onChange={handleChange} rows={3} />
                    </label>

                    <div className="coupon-form-row">
                        <label>
                            <span>Loại</span>
                            <select name="discountType" value={form.discountType} onChange={handleChange}>
                                <option value="PERCENT">Phần trăm</option>
                                <option value="FIXED">Số tiền</option>
                            </select>
                        </label>

                        <label>
                            <span>Giá trị</span>
                            <input name="discountValue" type="number" min="0" value={form.discountValue} onChange={handleChange} />
                        </label>
                    </div>

                    <div className="coupon-form-row">
                        <label>
                            <span>Đơn tối thiểu</span>
                            <input name="minOrderAmount" type="number" min="0" value={form.minOrderAmount} onChange={handleChange} />
                        </label>

                        <label>
                            <span>Giảm tối đa</span>
                            <input name="maxDiscountAmount" type="number" min="0" value={form.maxDiscountAmount} onChange={handleChange} />
                        </label>
                    </div>

                    <div className="coupon-form-row">
                        <label>
                            <span>Bắt đầu</span>
                            <input name="startDate" type="datetime-local" value={form.startDate} onChange={handleChange} />
                        </label>

                        <label>
                            <span>Kết thúc</span>
                            <input name="endDate" type="datetime-local" value={form.endDate} onChange={handleChange} />
                        </label>
                    </div>

                    <label>
                        <span>Giới hạn lượt dùng</span>
                        <input name="usageLimit" type="number" min="1" value={form.usageLimit} onChange={handleChange} />
                    </label>

                    <label className="coupon-checkbox">
                        <input name="active" type="checkbox" checked={form.active} onChange={handleChange} />
                        <span>Đang hoạt động</span>
                    </label>

                    {error && <p className="coupon-error">{error}</p>}
                    {message && <p className="coupon-success">{message}</p>}

                    <div className="coupon-form-actions">
                        <button type="submit" disabled={isSaving}>
                            {isSaving ? 'Đang lưu...' : editingId ? 'Cập nhật' : 'Tạo mã'}
                        </button>
                        {editingId && (
                            <button type="button" className="secondary" onClick={resetForm}>
                                Hủy sửa
                            </button>
                        )}
                    </div>
                </form>

                <section className="coupon-list-panel">
                    <h2>Danh sách mã giảm giá</h2>

                    {isLoading && <div className="coupon-empty">Đang tải...</div>}
                    {!isLoading && sortedCoupons.length === 0 && <div className="coupon-empty">Chưa có mã giảm giá.</div>}

                    {!isLoading && sortedCoupons.length > 0 && (
                        <div className="coupon-table-wrapper">
                            <table className="coupon-table">
                                <thead>
                                    <tr>
                                        <th>Mã</th>
                                        <th>Giá trị</th>
                                        <th>Đã dùng</th>
                                        <th>Trạng thái</th>
                                        <th></th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {sortedCoupons.map((coupon) => (
                                        <tr key={coupon.id}>
                                            <td>
                                                <strong>{coupon.code}</strong>
                                                <span>{coupon.name}</span>
                                            </td>
                                            <td>
                                                {coupon.discountType === 'PERCENT'
                                                    ? `${coupon.discountValue}%`
                                                    : `${coupon.discountValue.toLocaleString('vi-VN')} VND`}
                                            </td>
                                            <td>{coupon.usedCount}/{coupon.usageLimit || '∞'}</td>
                                            <td>
                                                <span className={`coupon-status ${coupon.active ? 'active' : 'inactive'}`}>
                                                    {coupon.active ? 'Đang bật' : 'Đã tắt'}
                                                </span>
                                            </td>
                                            <td className="coupon-actions">
                                                <button type="button" onClick={() => handleEdit(coupon)}>Sửa</button>
                                                <button type="button" onClick={() => handleToggle(coupon.id)}>
                                                    {coupon.active ? 'Tắt' : 'Bật'}
                                                </button>
                                                <button type="button" className="danger" onClick={() => handleDelete(coupon.id)}>Xóa</button>
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

export default AdminCoupons;
