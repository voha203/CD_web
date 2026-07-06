import axios from "axios";
import { getToken } from "../components/utils/auth";

const API_URL = "http://localhost:8080/api/auth";

export const login = (credentials) => {
    return axios.post(`${API_URL}/login`, credentials);
};

export const register = (userData) => {
    return axios.post(`${API_URL}/register`, userData);
};

export const forgotPassword = (email) => {
    return axios.post(`${API_URL}/forgot-password`, { email });
};

export const resetPassword = (payload) => {
    return axios.post(`${API_URL}/reset-password`, payload);
};

export const changePassword = (payload) => {
    return axios.put(`${API_URL}/change-password`, payload, {
        headers: { Authorization: `Bearer ${getToken()}` }
    });
};

export const getProfile = () => {
    const token = getToken();

    if (!token) return Promise.reject("No token found");
    
    return axios.get(`${API_URL}/profile`, {
        headers: { Authorization: `Bearer ${token}` }
    });
};
