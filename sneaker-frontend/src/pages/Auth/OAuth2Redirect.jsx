import React, { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { saveAuth } from "../../components/utils/auth";
import { getProfile } from "../../services/profileService";
import "./Auth.css";

function OAuth2Redirect() {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const [message, setMessage] = useState("Đang đăng nhập bằng Google...");

    useEffect(() => {
        const token = searchParams.get("token");
        const error = searchParams.get("error");

        if (error) {
            setMessage("Không thể đăng nhập bằng Google. Vui lòng thử lại.");
            setTimeout(() => navigate("/login", { replace: true }), 1500);
            return;
        }

        if (!token) {
            setMessage("Thiếu token đăng nhập Google. Vui lòng thử lại.");
            setTimeout(() => navigate("/login", { replace: true }), 1500);
            return;
        }

        const completeLogin = async () => {
            try {
                localStorage.setItem("token", token);
                const profileRes = await getProfile();
                saveAuth({
                    token,
                    user: profileRes.data
                });
                navigate("/", { replace: true });
            } catch (err) {
                localStorage.removeItem("token");
                setMessage("Không thể tải thông tin tài khoản Google.");
                setTimeout(() => navigate("/login", { replace: true }), 1500);
            }
        };

        completeLogin();
    }, [navigate, searchParams]);

    return (
        <main className="auth-oauth-page">
            <div className="auth-oauth-card">
                <span className="auth-oauth-spinner" aria-hidden="true"></span>
                <p>{message}</p>
            </div>
        </main>
    );
}

export default OAuth2Redirect;
