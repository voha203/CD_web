import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { detectIdentifier } from "../utils/validate";
import { saveAuth } from "../utils/auth";
import { login, register } from "../../services/authService";

export const useAuth = () => {
    const navigate = useNavigate();
    const location = useLocation();

    const [step, setStep] = useState("enter");
    const [identifier, setIdentifier] = useState("");
    const [identifierType, setIdentifierType] = useState("");
    const [error, setError] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    const [password, setPassword] = useState("");
    const [rePassword, setRePassword] = useState("");
    const [fullName, setFullName] = useState("");

    const redirectTo = location.state?.from?.pathname || "/";

    const resetForm = () => {
        setPassword("");
        setRePassword("");
        setFullName("");
        setError("");
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
        setStep("login");
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
            setError(err.response?.data?.error || "Sign in failed. Please check your account and password.");
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
            setError(err.response?.data?.error || "Could not create account. Please try another email or phone.");
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
        isSubmitting,
        password,
        setPassword,
        rePassword,
        setRePassword,
        fullName,
        setFullName,
        handleContinue,
        handleLogin,
        handleRegister,
        goToEnter,
    };
};
