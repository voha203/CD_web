import { useState } from "react";

export default function ResetPasswordStep({
    identifier,
    otp,
    setOtp,
    password,
    setPassword,
    rePassword,
    setRePassword,
    error,
    message,
    isSubmitting,
    onSubmit,
    onBack
}) {
    const [showPassword, setShowPassword] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit();
    };

    return (
        <form className="register-box" onSubmit={handleSubmit}>
            <div className="register-box-header">
                <h1>Đặt lại mật khẩu</h1>
                <p className="auth-helper-text">Mã OTP đã được gửi tới {identifier}</p>
            </div>

            <div className="register-box-input">
                <label>Mã OTP</label>
                <input
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    placeholder="Nhập mã OTP"
                />
            </div>

            <div className="register-box-input password-wrapper">
                <label>Mật khẩu mới</label>
                <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />
            </div>

            <div className="register-box-input password-wrapper">
                <label>Nhập lại mật khẩu mới</label>
                <input
                    type={showPassword ? "text" : "password"}
                    value={rePassword}
                    onChange={(e) => setRePassword(e.target.value)}
                />
                {rePassword && (
                    <button
                        type="button"
                        className="eye-btn"
                        onClick={() => setShowPassword(!showPassword)}
                    >
                        <span className="material-symbols-outlined">
                            {showPassword ? "visibility_off" : "visibility"}
                        </span>
                    </button>
                )}
            </div>

            {message && <p className="auth-success">{message}</p>}
            {error && <p className="auth-error">{error}</p>}

            <div className="register-box-btn">
                <button type="submit" disabled={isSubmitting}>
                    {isSubmitting ? "Đang cập nhật..." : "Đặt lại mật khẩu"}
                </button>
            </div>

            <div className="register-box-footer">
                <p>
                    Nhớ mật khẩu? <span onClick={onBack}>Đăng nhập</span>
                </p>
            </div>
        </form>
    );
}
