import { useState } from "react";
import { getGoogleLoginUrl } from "../../../services/authService";

export default function LoginStep({
    identifier,
    password,
    setPassword,
    goToEnter,
    onLogin,
    onCreate,
    onForgotPassword,
    error,
    message,
    isSubmitting
}) {
    // Nút "show-btn" giúp ẩn/hiện mật khẩu
    const [showPassword, setShowPassword] = useState(false);
    const handleSubmit = (e) => {
        e.preventDefault();
        onLogin();
    };

    const handleGoogleLogin = () => {
        window.location.href = getGoogleLoginUrl();
    };

    return (
        <form className="login-box" onSubmit={handleSubmit}>
            <div className="login-box-header">
                <h1>Sign in</h1>
            </div>

            <p>
                {identifier}{" "}
                <a className="change-btn">
                    <span onClick={goToEnter}>Change</span>
                </a>
            </p>

            <div className="login-box-input password-wrapper">
                <div className="password-header">
                    <label>Password</label>
                    <button className="forgot-password" type="button" onClick={onForgotPassword}>
                        Forgot password?
                    </button>
                </div>

                <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />

                {password && (
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

            {error && <p className="auth-error">{error}</p>}
            {message && <p className="auth-success">{message}</p>}

            <div className="login-box-btn">
                <button className="login-btn" type="submit" disabled={isSubmitting}>
                    {isSubmitting ? "Signing in..." : "Sign in"}
                </button>
            </div>

            <div className="or-divider">
                <span>or</span>
            </div>

            <div className="login-box-btn">
                <button className="google-login-btn" type="button" onClick={handleGoogleLogin}>
                    <span className="google-mark" aria-hidden="true">G</span>
                    Continue with Google
                </button>
            </div>

            <div className="login-box-btn">
                <button className="other-login-btn" type="button" onClick={onCreate}>
                    Create a new account
                </button>
            </div>
        </form>
    );
}
