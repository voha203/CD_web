import { useAuth } from "../../components/hooks/useAuth";
import "./Auth.css";
import ConfirmNewStep from "./components/ConfirmNewStep";
import EnterStep from "./components/EnterStep";
import LoginStep from "./components/LoginStep";
import OtpStep from "./components/OtpStep";
import RegisterStep from "./components/RegisterStep";

function Auth() {
    const auth = useAuth();

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
                        error={auth.error}
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
                        identifierType={auth.identifierType}
                        password={auth.password}
                        setPassword={auth.setPassword}
                        rePassword={auth.rePassword}
                        setRePassword={auth.setRePassword}
                        onVerify={() => {
                            const err = auth.handleVerifyPassword();
                            if (err) alert(err);
                        }}
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