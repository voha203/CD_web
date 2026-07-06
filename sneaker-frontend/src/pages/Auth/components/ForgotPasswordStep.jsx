export default function ForgotPasswordStep({
    identifier,
    setIdentifier,
    error,
    message,
    isSubmitting,
    onSubmit,
    onBack
}) {
    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit();
    };

    return (
        <form className="login-box" onSubmit={handleSubmit}>
            <div className="login-box-header">
                <h1>Quên mật khẩu</h1>
            </div>

            <p className="auth-helper-text">
                Nhập email tài khoản của bạn. Hệ thống sẽ gửi mã OTP để đặt lại mật khẩu.
            </p>

            <div className="login-box-input">
                <label>Email</label>
                <input
                    type="email"
                    value={identifier}
                    onChange={(e) => setIdentifier(e.target.value)}
                    placeholder="you@example.com"
                />
            </div>

            {message && <p className="auth-success">{message}</p>}
            {error && <p className="auth-error">{error}</p>}

            <div className="login-box-btn">
                <button className="login-btn" type="submit" disabled={isSubmitting}>
                    {isSubmitting ? "Đang gửi..." : "Gửi mã OTP"}
                </button>
            </div>

            <div className="login-box-btn">
                <button className="other-login-btn" type="button" onClick={onBack}>
                    Quay lại đăng nhập
                </button>
            </div>
        </form>
    );
}
