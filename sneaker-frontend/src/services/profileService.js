import apiClient from "./apiClient";

export const getProfile = () => {
    return apiClient.get("/auth/profile");
};

export const updateProfile = (payload) => {
    return apiClient.put("/auth/profile", payload);
};

export const changeProfilePassword = (payload) => {
    return apiClient.put("/auth/change-password", payload);
};
