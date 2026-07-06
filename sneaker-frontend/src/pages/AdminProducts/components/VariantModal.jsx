import React, { useMemo, useState } from 'react';
import ImageManager from './ImageManager';

const emptyVariant = {
    color: '',
    sku: '',
    active: true,
    sizes: [],
    images: []
};

function VariantModal({ variant, sizes, onClose, onSave }) {
    const [form, setForm] = useState(variant || emptyVariant);

    const sizeMap = useMemo(() => {
        return new Map((sizes || []).map(size => [String(size.id), size]));
    }, [sizes]);

    const setSizeQuantity = (sizeId, quantity) => {
        const existing = form.sizes || [];
        const nextSizes = existing.some(item => String(item.sizeId) === String(sizeId))
            ? existing.map(item => String(item.sizeId) === String(sizeId) ? { ...item, quantity: Number(quantity) } : item)
            : [...existing, { sizeId: Number(sizeId), quantity: Number(quantity) }];

        setForm(prev => ({
            ...prev,
            sizes: nextSizes.filter(item => item.quantity >= 0)
        }));
    };

    const getQuantity = (sizeId) => {
        const item = (form.sizes || []).find(size => String(size.sizeId) === String(sizeId));
        return item?.quantity ?? '';
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!form.color.trim()) return;

        onSave({
            ...form,
            color: form.color.trim(),
            sku: form.sku?.trim() || '',
            sizes: (form.sizes || []).filter(item => item.sizeId && Number(item.quantity) >= 0),
            images: form.images || []
        });
    };

    return (
        <div className="admin-modal-overlay" role="dialog" aria-modal="true">
            <form className="variant-modal" onSubmit={handleSubmit}>
                <div className="modal-heading">
                    <h2>{form.id ? 'Sửa variant' : 'Thêm variant'}</h2>
                    <button type="button" onClick={onClose}>Đóng</button>
                </div>

                <div className="form-row">
                    <label>
                        <span>Màu</span>
                        <input value={form.color} onChange={(e) => setForm(prev => ({ ...prev, color: e.target.value }))} />
                    </label>
                    <label>
                        <span>SKU</span>
                        <input value={form.sku || ''} onChange={(e) => setForm(prev => ({ ...prev, sku: e.target.value }))} />
                    </label>
                </div>

                <label className="inline-check">
                    <input
                        type="checkbox"
                        checked={form.active !== false}
                        onChange={(e) => setForm(prev => ({ ...prev, active: e.target.checked }))}
                    />
                    <span>Đang hiển thị</span>
                </label>

                <section>
                    <h3>Stock theo size</h3>
                    <div className="size-stock-grid">
                        {(sizes || []).map(size => (
                            <label key={size.id}>
                                <span>{size.value}</span>
                                <input
                                    type="number"
                                    min="0"
                                    value={getQuantity(size.id)}
                                    onChange={(e) => setSizeQuantity(size.id, e.target.value === '' ? 0 : e.target.value)}
                                />
                            </label>
                        ))}
                    </div>
                    {sizeMap.size === 0 && <p className="muted-text">Chưa tải được danh sách size.</p>}
                </section>

                <section>
                    <h3>Ảnh variant</h3>
                    <ImageManager
                        images={form.images || []}
                        onChange={(images) => setForm(prev => ({ ...prev, images }))}
                    />
                </section>

                <div className="modal-actions">
                    <button type="button" className="secondary" onClick={onClose}>Hủy</button>
                    <button type="submit">Lưu variant</button>
                </div>
            </form>
        </div>
    );
}

export default VariantModal;
