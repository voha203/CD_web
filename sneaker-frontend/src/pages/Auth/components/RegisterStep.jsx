import { useState } from "react";

export default function RegisterStep({
    identifier,
    password,
    setPassword,
    rePassword,
    setRePassword,
    fullName,
    setFullName,
    onVerify,
    onBack,
    error,
    isSubmitting
}) {
    // Nút "show-btn" giúp ẩn/hiện mật khẩu
    const [showPassword, setShowPassword] = useState(false);
    const [showRePassword, setShowRePassword] = useState(false);

    return (
        <div className="register-box">
            <div className="register-box-header">
                <h1>Create account</h1>
            </div>

            <div className="register-box-input">
                <label>Enter mobile number or email</label>
                <input type="text" value={identifier} disabled />
            </div>

            <div className="register-box-input">
                <label>Your name</label>
                <input
                    placeholder="First and last name"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                />
            </div>

            <div className="register-box-input password-wrapper">
                <label>Password (at least 6 characters)</label>
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

            <div className="warning-text">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="currentColor" className="bi bi-exclamation-circle-fill" viewBox="0 0 16 16">
                    <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0M8 4a.905.905 0 0 0-.9.995l.35 3.507a.552.552 0 0 0 1.1 0l.35-3.507A.905.905 0 0 0 8 4m.002 6a1 1 0 1 0 0 2 1 1 0 0 0 0-2" />
                </svg>
                <span>Passwords must be at least 6 characters.</span>
            </div>

            <div className="register-box-input password-wrapper">
                <label>Re-enter password</label>
                <input
                    type={showRePassword ? "text" : "password"}
                    value={rePassword}
                    onChange={(e) => setRePassword(e.target.value)}
                />

                {rePassword && (
                    <button
                        type="button"
                        className="eye-btn"
                        onClick={() => setShowRePassword(!showRePassword)}
                    >
                        <span className="material-symbols-outlined">
                            {showRePassword ? "visibility_off" : "visibility"}
                        </span>
                    </button>
                )}
            </div>

            <div className="warning-text">
                <span>By enrolling a mobile phone number, you consent to receive automated security notifications via text message from mysneaker. Your mobile phone number will not be shared with third parties or affiliates for marketing or promotional purposes without your permission. Remove your number in Login & Security to cancel. For more information, visit mysneaker.com/help or call +84 090 123 4567. Message and data rates may apply. Message frequency varies.</span>
            </div>

            {error && <p className="auth-error">{error}</p>}

            <div className="register-box-btn">
                <button onClick={onVerify} disabled={isSubmitting}>
                    {isSubmitting ? "Creating account..." : "Create account"}
                </button>
            </div>

            <div className="divider"></div>

            <div className="register-box-footer">
                <p>Already a customer?</p>
                <span onClick={onBack}>Sign in instead</span>
            </div>

            <p className="terms">
                By creating an account, you agree to mysneaker's{" "}
                <span>Conditions of Use</span> and{" "}
                <span>Privacy Notice</span>.
            </p>
        </div>
    );
}
