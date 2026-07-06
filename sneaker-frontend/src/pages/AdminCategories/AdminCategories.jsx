import React, { useEffect, useState } from 'react';
import { FiEdit2, FiPlus, FiSearch } from 'react-icons/fi';
import { getApiErrorMessage } from '../../services/apiError';
import {
    createAdminCategory,
    getAdminCategories,
    updateAdminCategory,
    updateAdminCategoryStatus
} from '../../services/adminService';
import './AdminCategories.css';

const emptyForm = { name: '', code: '', active: true };

function AdminCategories() {
    const [categories, setCategories] = useState([]);
    const [keyword, setKeyword] = useState('');
    const [form, setForm] = useState(emptyForm);
    const [editingId, setEditingId] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [error, setError] = useState('');
    const [message, setMessage] = useState('');

    const loadCategories = async () => {
        setIsLoading(true);
        setError('');
        try {
            const res = await getAdminCategories({ keyword: keyword.trim() || undefined });
            setCategories(res.data || []);
        } catch (err) {
            setError(getApiErrorMessage(err, 'Không thể tải danh mục.'));
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        loadCategories();
    }, []);

    const resetForm = () => {
        setForm(emptyForm);
        setEditingId(null);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSaving(true);
        setError('');
        setMessage('');

        try {
            const payload = {
                name: form.name.trim(),
                code: form.code.trim().toUpperCase(),
                active: Boolean(form.active)
            };

            if (editingId) {
                await updateAdminCategory(editingId, payload);
                setMessage('Cập nhật danh mục thành công.');
            } else {
                await createAdminCategory(payload);
                setMessage('Tạo danh mục thành công.');
            }
            resetForm();
            await loadCategories();
        } catch (err) {
            setError(getApiErrorMessage(err, 'Không thể lưu danh mục.'));
        } finally {
            setIsSaving(false);
        }
    };

    const handleEdit = (category) => {
        setEditingId(category.id);
        setForm({
            name: category.name || '',
            code: category.code || '',
            active: category.active !== false
        });
    };

    const handleToggle = async (category) => {
        if (!window.confirm(`${category.active ? 'Ẩn' : 'Mở'} danh mục này?`)) return;

        try {
            await updateAdminCategoryStatus(category.id, !category.active);
            setMessage('Cập nhật trạng thái danh mục thành công.');
            await loadCategories();
        } catch (err) {
            setError(getApiErrorMessage(err, 'Không thể cập nhật trạng thái danh mục.'));
        }
    };

    return (
        <main className="admin-categories-page">
            <div className="admin-page-heading">
                <div>
                    <h1>Quản lý danh mục</h1>
                    <p>Thêm, sửa và ẩn danh mục sản phẩm.</p>
                </div>
            </div>

            {error && <div className="admin-alert error">{error}</div>}
            {message && <div className="admin-alert success">{message}</div>}

            <section className="admin-category-layout">
                <form className="admin-category-form" onSubmit={handleSubmit}>
                    <h2>{editingId ? 'Sửa danh mục' : 'Thêm danh mục'}</h2>
                    <label>
                        <span>Tên</span>
                        <input value={form.name} onChange={(e) => setForm(prev => ({ ...prev, name: e.target.value }))} required />
                    </label>
                    <label>
                        <span>Mã</span>
                        <input value={form.code} onChange={(e) => setForm(prev => ({ ...prev, code: e.target.value }))} required />
                    </label>
                    <label className="inline-check">
                        <input type="checkbox" checked={form.active} onChange={(e) => setForm(prev => ({ ...prev, active: e.target.checked }))} />
                        <span>Đang hiển thị</span>
                    </label>
                    <div className="category-form-actions">
                        <button type="submit" disabled={isSaving}>{isSaving ? 'Đang lưu...' : editingId ? 'Cập nhật' : 'Tạo danh mục'}</button>
                        {editingId && <button type="button" className="secondary" onClick={resetForm}>Hủy</button>}
                    </div>
                </form>

                <section className="admin-category-table-card">
                    <form className="category-search" onSubmit={(e) => { e.preventDefault(); loadCategories(); }}>
                        <FiSearch />
                        <input value={keyword} onChange={(e) => setKeyword(e.target.value)} placeholder="Tìm danh mục..." />
                        <button type="submit">Tìm</button>
                    </form>

                    {isLoading && <div className="admin-empty">Đang tải...</div>}
                    {!isLoading && (
                        <div className="category-table-wrap">
                            <table className="category-table">
                                <thead>
                                    <tr>
                                        <th>Tên</th>
                                        <th>Mã</th>
                                        <th>Sản phẩm</th>
                                        <th>Status</th>
                                        <th></th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {categories.map(category => (
                                        <tr key={category.id}>
                                            <td><strong>{category.name}</strong></td>
                                            <td>{category.code}</td>
                                            <td>{category.productCount}</td>
                                            <td>
                                                <span className={`admin-badge ${category.active ? 'status-DELIVERED' : 'status-CANCELLED'}`}>
                                                    {category.active ? 'Active' : 'Inactive'}
                                                </span>
                                            </td>
                                            <td className="category-actions">
                                                <button type="button" onClick={() => handleEdit(category)}><FiEdit2 /> Sửa</button>
                                                <button type="button" className="danger" onClick={() => handleToggle(category)}>
                                                    {category.active ? 'Ẩn' : 'Mở'}
                                                </button>
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

export default AdminCategories;
