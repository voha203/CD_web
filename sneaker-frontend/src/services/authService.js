import axios from "axios";
import { getToken } from "../components/utils/auth";

const API_URL = "http://localhost:8080/api/auth";

export const login = (credentials) => {
    return axios.post(`${API_URL}/login`, credentials);
};

export const register = (userData) => {
    return axios.post(`${API_URL}/register`, userData);
};

export const getProfile = () => {
    const token = getToken();

    if (!token) return Promise.reject("No token found");
    
    return axios.get(`${API_URL}/profile`, {
        headers: { Authorization: `Bearer ${token}` }
    });
};
