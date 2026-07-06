import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { detectIdentifier } from "../utils/validate";
import { saveAuth } from "../utils/auth";
import { forgotPassword, login, register, resetPassword } from "../../services/authService";
import { getApiErrorMessage } from "../../services/apiError";

export const useAuth = () => {
    const navigate = useNavigate();
    const location = useLocation();

    const [step, setStep] = useState("enter");
    const [identifier, setIdentifier] = useState("");
    const [identifierType, setIdentifierType] = useState("");
    const [error, setError] = useState("");
    const [message, setMessage] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    const [password, setPassword] = useState("");
    const [rePassword, setRePassword] = useState("");
    const [fullName, setFullName] = useState("");
    const [otp, setOtp] = useState("");

    const redirectTo = location.state?.from?.pathname || "/";

    const resetForm = () => {
        setPassword("");
        setRePassword("");
        setFullName("");
        setOtp("");
        setError("");
        setMessage("");
    };

    const goToEnter = () => {
        resetForm();
        setIdentifier("");
        setIdentifierType("");
        setStep("enter");
    };

    const handleContinue = () => {
        const type = detectIdentifier(identifier);

        if (type === "invalid") {
            setError("Enter a valid email or mobile number");
            return;
        }

        setIdentifierType(type);
        setError("");
        setMessage("");
        setStep("login");
    };

    const goToForgotPassword = () => {
        setPassword("");
        setRePassword("");
        setOtp("");
        setError("");
        setMessage("");
        setStep("forgot-password");
    };

    const handleLogin = async () => {
        if (!password) {
            setError("Please enter your password");
            return;
        }

        setIsSubmitting(true);
        setError("");

        try {
            const res = await login({
                username: identifier,
                password
            });

            saveAuth({
                token: res.data.token,
                user: res.data.user
            });

            navigate(redirectTo, { replace: true });
        } catch (err) {
            setError(getApiErrorMessage(err, "Sign in failed. Please check your account and password."));
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleRegister = async () => {
        if (!fullName.trim()) {
            setError("Please enter your name");
            return;
        }
        if (password.length < 6) {
            setError("Password must be at least 6 characters");
            return;
        }
        if (password !== rePassword) {
            setError("Passwords do not match");
            return;
        }

        setIsSubmitting(true);
        setError("");

        const isEmail = identifierType === "email";

        try {
            await register({
                username: identifier,
                password,
                email: isEmail ? identifier : null,
                fullName,
                phone: isEmail ? null : identifier,
                address: ""
            });

            const res = await login({
                username: identifier,
                password
            });

            saveAuth({
                token: res.data.token,
                user: res.data.user
            });

            navigate(redirectTo, { replace: true });
        } catch (err) {
            setError(getApiErrorMessage(err, "Could not create account. Please try another email or phone."));
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleForgotPassword = async () => {
        const type = detectIdentifier(identifier);

        if (type !== "email") {
            setError("Vui lòng nhập email hợp lệ để nhận mã OTP");
            return;
        }

        setIsSubmitting(true);
        setError("");
        setMessage("");

        try {
            await forgotPassword(identifier);
            setMessage("Mã OTP đã được gửi về email của bạn.");
            setStep("reset-password");
        } catch (err) {
            setError(getApiErrorMessage(err, "Không thể gửi mã OTP. Vui lòng kiểm tra email."));
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleResetPassword = async () => {
        if (!otp.trim()) {
            setError("Vui lòng nhập mã OTP");
            return;
        }
        if (password.length < 6) {
            setError("Mật khẩu mới phải có ít nhất 6 ký tự");
            return;
        }
        if (password !== rePassword) {
            setError("Mật khẩu nhập lại không khớp");
            return;
        }

        setIsSubmitting(true);
        setError("");
        setMessage("");

        try {
            await resetPassword({
                email: identifier,
                otp,
                newPassword: password,
                confirmPassword: rePassword
            });

            setMessage("Đặt lại mật khẩu thành công. Bạn có thể đăng nhập lại.");
            setPassword("");
            setRePassword("");
            setOtp("");
            setStep("login");
        } catch (err) {
            setError(getApiErrorMessage(err, "Không thể đặt lại mật khẩu. Vui lòng kiểm tra OTP."));
        } finally {
            setIsSubmitting(false);
        }
    };

    return {
        step,
        setStep,
        identifier,
        setIdentifier,
        identifierType,
        error,
        message,
        isSubmitting,
        password,
        setPassword,
        rePassword,
        setRePassword,
        fullName,
        setFullName,
        otp,
        setOtp,
        handleContinue,
        handleLogin,
        handleRegister,
        handleForgotPassword,
        handleResetPassword,
        goToForgotPassword,
        goToEnter,
    };
};
