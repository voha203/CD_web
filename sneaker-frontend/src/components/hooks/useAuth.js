import { useState } from "react";
import { detectIdentifier } from "../utils/validate";

export const useAuth = () => {
    const [step, setStep] = useState("enter");  // Lưu trang giao diện hiện tại
    const [identifier, setIdentifier] = useState("");  // Lưu email dùng để đăng nhập hoặc đăng kí
    const [identifierType, setIdentifierType] = useState("");  // "email" | "phone"
    const [error, setError] = useState("");

    // Lưu mật khẩu đang tạo
    const [password, setPassword] = useState("");
    const [rePassword, setRePassword] = useState("");

    // Dữ liệu mẫu để đăng nhập
    const fakeUsers = ["admin@gmail.com", "user@gmail.com", "0906407013"];

    const resetForm = () => {
        setPassword("");
        setRePassword("");
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

        if (fakeUsers.includes(identifier)) {
            setStep("login");
        } else {
            setStep("confirm-new");
        }
    };

    // Kiểm tra độ dài của mật khẩu
    const handleVerifyPassword = () => {
        if (password.length < 6) {
            return "Password must be at least 6 characters";
        }
        if (password !== rePassword) {
            return "Passwords do not match";
        }
        setStep("verify");
        return null;
    };

    return {
        step,
        setStep,
        identifier,
        setIdentifier,
        identifierType,
        error,
        password,
        setPassword,
        rePassword,
        setRePassword,
        handleContinue,
        handleVerifyPassword,
        goToEnter,
    };
};