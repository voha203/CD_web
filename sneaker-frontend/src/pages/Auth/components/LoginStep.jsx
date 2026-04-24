import { useState } from "react";

export default function LoginStep({
    identifier,
    password,
    setPassword,
    goToEnter
}) {
    // Nút "show-btn" giúp ẩn/hiện mật khẩu
    const [showPassword, setShowPassword] = useState(false);
    const [showRePassword, setShowRePassword] = useState(false);


    return (
        <div className="login-box">
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
                    <span className="forgot-password">Forgot password?</span>
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

            <div className="login-box-btn">
                <button className="login-btn">
                    Sign in
                </button>
            </div>

            <div className="or-divider">
                <span>or</span>
            </div>

            <div className="login-box-btn">
                <button className="other-login-btn" onClick={() => setStep("register")}>
                    Sign in with a passkey
                </button>
            </div>

            <div className="login-box-btn">
                <button className="other-login-btn" onClick={() => setStep("register")}>
                    Sign in with a code
                </button>
            </div>
        </div>
    );
}