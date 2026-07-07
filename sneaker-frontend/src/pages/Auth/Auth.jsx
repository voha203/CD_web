import { useAuth } from "../../components/hooks/useAuth";
import "./Auth.css";
import ConfirmNewStep from "./components/ConfirmNewStep";
import EnterStep from "./components/EnterStep";
import ForgotPasswordStep from "./components/ForgotPasswordStep";
import LoginStep from "./components/LoginStep";
import OtpStep from "./components/OtpStep";
import RegisterStep from "./components/RegisterStep";
import ResetPasswordStep from "./components/ResetPasswordStep";
import { useSearchParams } from "react-router-dom";

function Auth() {
    const auth = useAuth();
    const [searchParams] = useSearchParams();
    const oauthError = searchParams.get("oauth2Error")
        ? "Không thể đăng nhập bằng Google. Vui lòng thử lại."
        : "";

    return (
        <div className="auth">
            {/* ========== Logo ========== */}
            <div className="logo-container">
                <span className="logo-text">mysneaker</span>
            </div>

            {/* ========== Box ========== */}
            <div className="auth-box">
                {/* ===== Giao diện hiển thị đầu tiên khi khách bấm vào ô đăng nhập/đăng ký ==== */}
                {auth.step === "enter" && (
                    <EnterStep
                        identifier={auth.identifier}
                        setIdentifier={auth.setIdentifier}
                        onContinue={auth.handleContinue}
                        error={auth.error || oauthError}
                        isSubmitting={auth.isSubmitting}
                    />
                )}

                {/* ===== Giao diện khi hệ thống kiểm tra ra dữ liệu người dùng chưa tồn tại trong hệ thống ===== */}
                {auth.step === "confirm-new" && (
                    <ConfirmNewStep
                        identifier={auth.identifier}
                        identifierType={auth.identifierType}
                        onBack={auth.goToEnter}
                        onCreate={() => auth.setStep("register")}
                    />
                )}

                {/* ===== Giao diện để người dùng đăng kí tài khoản ===== */}
                {auth.step === "register" && (
                    <RegisterStep
                        identifier={auth.identifier}
                        password={auth.password}
                        setPassword={auth.setPassword}
                        rePassword={auth.rePassword}
                        setRePassword={auth.setRePassword}
                        fullName={auth.fullName}
                        setFullName={auth.setFullName}
                        error={auth.error}
                        isSubmitting={auth.isSubmitting}
                        onVerify={auth.handleRegister}
                        onBack={auth.goToEnter}
                    />
                )}

                {/* ========== Giao diện để người dùng nhập mã OTP để xác nhận tạo tài khoản ========== */}
                {auth.step === "verify" && (
                    <OtpStep
                        identifier={auth.identifier}
                        identifierType={auth.identifierType}
                        onBack={auth.goToEnter}
                        onSuccess={() => auth.setStep("login")}
                    />
                )}

                {/* ========= Giao diện trang đăng nhập để người dùng thao tác ========== */}
                {auth.step === "login" && (
                    <LoginStep
                        identifier={auth.identifier}
                        password={auth.password}
                        setPassword={auth.setPassword}
                        goToEnter={auth.goToEnter}
                        onLogin={auth.handleLogin}
                        onCreate={() => auth.setStep("register")}
                        onForgotPassword={auth.goToForgotPassword}
                        error={auth.error}
                        message={auth.message}
                        isSubmitting={auth.isSubmitting}
                    />
                )}

                {auth.step === "forgot-password" && (
                    <ForgotPasswordStep
                        identifier={auth.identifier}
                        setIdentifier={auth.setIdentifier}
                        error={auth.error}
                        message={auth.message}
                        isSubmitting={auth.isSubmitting}
                        onSubmit={auth.handleForgotPassword}
                        onBack={() => auth.setStep("login")}
                    />
                )}

                {auth.step === "reset-password" && (
                    <ResetPasswordStep
                        identifier={auth.identifier}
                        otp={auth.otp}
                        setOtp={auth.setOtp}
                        password={auth.password}
                        setPassword={auth.setPassword}
                        rePassword={auth.rePassword}
                        setRePassword={auth.setRePassword}
                        error={auth.error}
                        message={auth.message}
                        isSubmitting={auth.isSubmitting}
                        onSubmit={auth.handleResetPassword}
                        onBack={() => auth.setStep("login")}
                    />
                )}
            </div>

            {/* ========== Footer ========== */}
            <div className="footer">
                <div className="footer-links">
                    <span>Conditions of Use</span>
                    <span>Privacy Notice</span>
                    <span>Help</span>
                </div>
                <p>© 2026, mysneaker.com, Inc. or its affiliates</p>
            </div>
        </div >
    );
}
export default Auth;
