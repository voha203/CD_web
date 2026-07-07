import React, { useMemo, useState } from 'react';
import VariantModal from './VariantModal';

const emptyProduct = {
    name: '',
    brand: '',
    price: '',
    categoryId: '',
    description: '',
    active: true,
    variants: []
};

const normalizeVariant = (variant) => ({
    ...variant,
    images: (variant.images || []).map(image => ({
        id: image.id,
        imageUrl: image.imageUrl,
        publicId: image.publicId || '',
        main: image.main ?? image.isMain ?? false,
        sortOrder: image.sortOrder ?? 0
    })),
    sizes: variant.sizes || []
});

function ProductForm({ product, categories, sizes, onClose, onSubmit, isSaving }) {
    const [form, setForm] = useState(() => ({
        ...emptyProduct,
        ...(product || {}),
        price: product?.price ?? '',
        categoryId: product?.categoryId ?? '',
        variants: (product?.variants || []).map(normalizeVariant)
    }));
    const [editingVariantIndex, setEditingVariantIndex] = useState(null);

    const activeCategories = useMemo(() => {
        return (categories || []).filter(category => category.active !== false);
    }, [categories]);

    const updateField = (name, value) => {
        setForm(prev => ({ ...prev, [name]: value }));
    };

    const handleSaveVariant = (variant) => {
        setForm(prev => {
            const variants = [...(prev.variants || [])];
            if (editingVariantIndex === 'new') variants.push(variant);
            else variants[editingVariantIndex] = variant;
            return { ...prev, variants };
        });
        setEditingVariantIndex(null);
    };

    const handleSubmit = () => {
        onSubmit({
            name: form.name.trim(),
            brand: form.brand.trim(),
            price: Number(form.price),
            categoryId: Number(form.categoryId),
            description: form.description?.trim() || '',
            active: Boolean(form.active),
            variants: (form.variants || []).map(variant => ({
                id: variant.id,
                color: variant.color,
                sku: variant.sku || '',
                active: variant.active !== false,
                sizes: (variant.sizes || []).map(size => ({
                    id: size.id,
                    sizeId: Number(size.sizeId),
                    quantity: Number(size.quantity || 0)
                })),
                images: (variant.images || []).map(image => ({
                    id: image.id,
                    imageUrl: image.imageUrl,
                    publicId: image.publicId || '',
                    main: Boolean(image.main),
                    sortOrder: image.sortOrder ?? 0
                }))
            }))
        });
    };

    return (
        <div className="admin-modal-overlay" role="dialog" aria-modal="true">
            <div className="product-form-modal">
                <div className="modal-heading">
                    <h2>{product?.id ? 'Sửa sản phẩm' : 'Thêm sản phẩm'}</h2>
                    <button type="button" onClick={onClose}>Đóng</button>
                </div>

                <div className="form-row">
                    <label>
                        <span>Tên sản phẩm</span>
                        <input value={form.name} onChange={(e) => updateField('name', e.target.value)} required />
                    </label>
                    <label>
                        <span>Brand</span>
                        <input value={form.brand} onChange={(e) => updateField('brand', e.target.value)} required />
                    </label>
                </div>

                <div className="form-row">
                    <label>
                        <span>Giá gốc</span>
                        <input type="number" min="1" value={form.price} onChange={(e) => updateField('price', e.target.value)} required />
                    </label>
                    <label>
                        <span>Category</span>
                        <select value={form.categoryId} onChange={(e) => updateField('categoryId', e.target.value)} required>
                            <option value="">Chọn category</option>
                            {activeCategories.map(category => (
                                <option key={category.id} value={category.id}>{category.name}</option>
                            ))}
                        </select>
                    </label>
                </div>

                <label>
                    <span>Mô tả</span>
                    <textarea rows={4} value={form.description || ''} onChange={(e) => updateField('description', e.target.value)} />
                </label>

                <label className="inline-check">
                    <input type="checkbox" checked={form.active !== false} onChange={(e) => updateField('active', e.target.checked)} />
                    <span>Đang bán</span>
                </label>

                <section className="variant-section">
                    <div className="section-toolbar">
                        <h3>Variants</h3>
                        <button type="button" onClick={() => setEditingVariantIndex('new')}>Thêm variant</button>
                    </div>

                    <div className="variant-list">
                        {(form.variants || []).length === 0 && <p className="muted-text">Chưa có variant.</p>}
                        {(form.variants || []).map((variant, index) => (
                            <div className="variant-row" key={`${variant.id || 'new'}-${index}`}>
                                <div>
                                    <strong>{variant.color}</strong>
                                    <span>{variant.sku || 'Chưa có SKU'} - {(variant.sizes || []).reduce((sum, item) => sum + Number(item.quantity || 0), 0)} đôi</span>
                                </div>
                                <span className={`admin-badge ${variant.active === false ? 'status-CANCELLED' : 'status-DELIVERED'}`}>
                                    {variant.active === false ? 'Đang ẩn' : 'Đang hiện'}
                                </span>
                                <button type="button" onClick={() => setEditingVariantIndex(index)}>Sửa</button>
                            </div>
                        ))}
                    </div>
                </section>

                <div className="modal-actions">
                    <button type="button" className="secondary" onClick={onClose}>Hủy</button>
                    <button type="button" onClick={handleSubmit} disabled={isSaving}>{isSaving ? 'Đang lưu...' : 'Lưu sản phẩm'}</button>
                </div>
            </div>

            {editingVariantIndex !== null && (
                <VariantModal
                    variant={editingVariantIndex === 'new' ? undefined : form.variants[editingVariantIndex]}
                    sizes={sizes}
                    onClose={() => setEditingVariantIndex(null)}
                    onSave={handleSaveVariant}
                />
            )}
        </div>
    );
}

export default ProductForm;
