import React, { useState } from 'react';

function ImageManager({ images = [], onChange }) {
    const [imageUrl, setImageUrl] = useState('');

    const addImage = () => {
        const url = imageUrl.trim();
        if (!url) return;

        onChange([
            ...images,
            { imageUrl: url, main: images.length === 0 }
        ]);
        setImageUrl('');
    };

    const removeImage = (index) => {
        const nextImages = images.filter((_, itemIndex) => itemIndex !== index);
        if (nextImages.length > 0 && !nextImages.some(image => image.main)) {
            nextImages[0].main = true;
        }
        onChange(nextImages);
    };

    const setMain = (index) => {
        onChange(images.map((image, itemIndex) => ({
            ...image,
            main: itemIndex === index
        })));
    };

    return (
        <div className="image-manager">
            <div className="image-manager-input">
                <input
                    value={imageUrl}
                    onChange={(e) => setImageUrl(e.target.value)}
                    placeholder="https://..."
                />
                <button type="button" onClick={addImage}>Thêm ảnh</button>
            </div>

            <div className="image-url-list">
                {images.length === 0 && <span className="muted-text">Chưa có ảnh.</span>}
                {images.map((image, index) => (
                    <div className="image-url-item" key={`${image.imageUrl}-${index}`}>
                        <img src={image.imageUrl} alt="" />
                        <span>{image.imageUrl}</span>
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
