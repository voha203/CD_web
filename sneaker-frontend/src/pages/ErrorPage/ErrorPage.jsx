import React from 'react';
import { Link } from 'react-router-dom';
import './ErrorPage.css';

const content = {
    403: {
        title: 'Bạn không có quyền truy cập',
        description: 'Tài khoản hiện tại không được phép mở khu vực này.'
    },
    500: {
        title: 'Hệ thống đang gặp lỗi',
        description: 'Vui lòng thử lại sau hoặc quay về trang chủ.'
    },
    404: {
        title: 'Không tìm thấy trang',
        description: 'Đường dẫn này không tồn tại hoặc đã được di chuyển.'
    }
};

function ErrorPage({ code = 404 }) {
    const page = content[code] || content[404];

    return (
        <main className="error-page">
            <section className="error-panel">
                <span className="error-code">{code}</span>
                <h1>{page.title}</h1>
                <p>{page.description}</p>
                <div className="error-actions">
                    <Link to="/" className="error-primary">Về trang chủ</Link>
                    <Link to="/products" className="error-secondary">Xem sản phẩm</Link>
                </div>
            </section>
        </main>
    );
}

export default ErrorPage;
