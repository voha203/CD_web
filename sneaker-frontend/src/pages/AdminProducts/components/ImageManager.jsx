import React, { useRef, useState } from 'react';
import { uploadAdminProductImage } from '../../../services/adminService';
import { getApiErrorMessage } from '../../../services/apiError';
import { PLACEHOLDER_IMAGE_300 } from '../../../config/apiConfig';

const MAX_FILE_SIZE = 5 * 1024 * 1024;
const ACCEPTED_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
const PLACEHOLDER_IMAGE = PLACEHOLDER_IMAGE_300;

function ImageManager({ images = [], onChange }) {
    const [isDragging, setIsDragging] = useState(false);
    const [isUploading, setIsUploading] = useState(false);
    const [error, setError] = useState('');
    const fileInputRef = useRef(null);

    const normalizeImages = (nextImages) => {
        const normalized = nextImages.map((image, index) => ({
            ...image,
            main: Boolean(image.main ?? image.isMain),
            sortOrder: image.sortOrder ?? index
        }));

        if (normalized.length > 0 && !normalized.some(image => image.main)) {
            normalized[0].main = true;
        }

        return normalized.map((image, index) => ({
            ...image,
            main: image.main && normalized.findIndex(item => item.main) === index,
            sortOrder: index
        }));
    };

    const validateFile = (file) => {
        if (!ACCEPTED_TYPES.includes(file.type)) {
            return `${file.name}: chỉ hỗ trợ JPG, JPEG, PNG hoặc WEBP.`;
        }

        if (file.size > MAX_FILE_SIZE) {
            return `${file.name}: ảnh không được vượt quá 5MB.`;
        }

        return '';
    };

    const handleFiles = async (fileList) => {
        const files = Array.from(fileList || []);
        if (files.length === 0 || isUploading) return;

        const validationError = files.map(validateFile).find(Boolean);
        if (validationError) {
            setError(validationError);
            return;
        }

        setIsUploading(true);
        setError('');

        try {
            const uploadedImages = [];

            for (const file of files) {
                const res = await uploadAdminProductImage(file);
                uploadedImages.push({
                    imageUrl: res.data.imageUrl,
                    publicId: res.data.publicId,
                    main: images.length === 0 && uploadedImages.length === 0,
                    sortOrder: images.length + uploadedImages.length
                });
            }

            onChange(normalizeImages([...images, ...uploadedImages]));
        } catch (err) {
            const message = !err?.response
                ? 'Không kết nối được API upload. Hãy kiểm tra backend đã restart, CORS và cấu hình Cloudinary.'
                : getApiErrorMessage(err, 'Không thể upload ảnh. Vui lòng kiểm tra Cloudinary hoặc thử lại.');
            setError(message);
        } finally {
            setIsUploading(false);
            if (fileInputRef.current) fileInputRef.current.value = '';
        }
    };

    const removeImage = (index) => {
        onChange(normalizeImages(images.filter((_, itemIndex) => itemIndex !== index)));
    };

    const setMain = (index) => {
        onChange(normalizeImages(images.map((image, itemIndex) => ({
            ...image,
            main: itemIndex === index
        }))));
    };

    const onDrop = (event) => {
        event.preventDefault();
        setIsDragging(false);
        handleFiles(event.dataTransfer.files);
    };

    return (
        <div className="image-manager">
            <div
                className={`image-upload-zone ${isDragging ? 'dragging' : ''}`}
                onDragEnter={(event) => {
                    event.preventDefault();
                    setIsDragging(true);
                }}
                onDragOver={(event) => event.preventDefault()}
                onDragLeave={() => setIsDragging(false)}
                onDrop={onDrop}
            >
                <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/jpeg,image/jpg,image/png,image/webp"
                    multiple
                    hidden
                    onChange={(event) => handleFiles(event.target.files)}
                />
                <strong>Kéo thả ảnh sản phẩm vào đây</strong>
                <span>JPG, PNG, WEBP - tối đa 5MB mỗi ảnh</span>
                <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={isUploading}
                >
                    {isUploading ? 'Đang upload...' : 'Chọn ảnh'}
                </button>
            </div>

            {error && <p className="image-upload-error">{error}</p>}

            <div className="image-url-list">
                {images.length === 0 && <span className="muted-text">Chưa có ảnh.</span>}
                {images.map((image, index) => (
                    <div className="image-url-item" key={`${image.imageUrl}-${index}`}>
                        <img
                            src={image.imageUrl || PLACEHOLDER_IMAGE}
                            alt=""
                            onError={(event) => {
                                event.currentTarget.src = PLACEHOLDER_IMAGE;
                            }}
                        />
                        <span title={image.imageUrl}>{image.imageUrl}</span>
                        {image.publicId && <small title={image.publicId}>{image.publicId}</small>}
                        <button type="button" onClick={() => setMain(index)}>
                            {image.main ? 'Ảnh chính' : 'Chọn chính'}
                        </button>
                        <button type="button" className="danger" onClick={() => removeImage(index)}>Xóa</button>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default ImageManager;
