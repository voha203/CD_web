import apiClient from "./apiClient";

export const login = (credentials) => {
    return apiClient.post("/auth/login", credentials);
};

export const register = (userData) => {
    return apiClient.post("/auth/register", userData);
};

export const forgotPassword = (email) => {
    return apiClient.post("/auth/forgot-password", { email });
};

export const resetPassword = (payload) => {
    return apiClient.post("/auth/reset-password", payload);
};

export const changePassword = (payload) => {
    return apiClient.put("/auth/change-password", payload);
};

export const getProfile = () => {
    return apiClient.get("/auth/profile");
};

export const getGoogleLoginUrl = () => {
    return "http://localhost:8080/oauth2/authorization/google";
};
