import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { changePassword } from '../../services/authService';
import './ChangePassword.css';

const getApiErrorMessage = (err, fallback) => {
    const data = err.response?.data;

    if (typeof data === 'string') return data;
    if (data?.error) return data.error;
    if (data?.message) return data.message;

    return fallback;
};

function ChangePassword() {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        oldPassword: '',
        newPassword: '',
        confirmPassword: ''
    });
    const [error, setError] = useState('');
    const [message, setMessage] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        setError('');
        setMessage('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!formData.oldPassword) {
            setError('Vui lòng nhập mật khẩu hiện tại');
            return;
        }
        if (formData.newPassword.length < 6) {
            setError('Mật khẩu mới phải có ít nhất 6 ký tự');
            return;
        }
        if (formData.newPassword !== formData.confirmPassword) {
            setError('Mật khẩu xác nhận không khớp');
            return;
        }

        setIsSubmitting(true);
        setError('');
        setMessage('');

        try {
            await changePassword(formData);
            setMessage('Đổi mật khẩu thành công.');
            setFormData({
                oldPassword: '',
                newPassword: '',
                confirmPassword: ''
            });
        } catch (err) {
            setError(getApiErrorMessage(err, 'Không thể đổi mật khẩu. Vui lòng kiểm tra mật khẩu hiện tại.'));
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <main className="change-password-page">
            <form className="change-password-panel" onSubmit={handleSubmit}>
                <div className="change-password-header">
                    <h1>Đổi mật khẩu</h1>
                    <p>Cập nhật mật khẩu mới để bảo vệ tài khoản của bạn.</p>
                </div>

                <label className="change-password-field">
                    <span>Mật khẩu hiện tại</span>
                    <input
                        name="oldPassword"
                        type="password"
                        value={formData.oldPassword}
                        onChange={handleChange}
                    />
                </label>

                <label className="change-password-field">
                    <span>Mật khẩu mới</span>
                    <input
                        name="newPassword"
                        type="password"
                        value={formData.newPassword}
                        onChange={handleChange}
                    />
                </label>

                <label className="change-password-field">
                    <span>Nhập lại mật khẩu mới</span>
                    <input
                        name="confirmPassword"
                        type="password"
                        value={formData.confirmPassword}
                        onChange={handleChange}
                    />
                </label>

                {message && <p className="change-password-success">{message}</p>}
                {error && <p className="change-password-error">{error}</p>}

                <div className="change-password-actions">
                    <button type="button" className="secondary-btn" onClick={() => navigate(-1)}>
                        Quay lại
                    </button>
                    <button type="submit" className="primary-btn" disabled={isSubmitting}>
                        {isSubmitting ? 'Đang cập nhật...' : 'Cập nhật mật khẩu'}
                    </button>
                </div>
            </form>
        </main>
    );
}

export default ChangePassword;
