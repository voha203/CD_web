import axios from "axios";
import { getToken } from "../components/utils/auth";
import { API_BASE_URL } from "../config/apiConfig";

const apiClient = axios.create({
    baseURL: API_BASE_URL,
    timeout: 15000
});

apiClient.interceptors.request.use((config) => {
    const token = getToken();

    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
});

export default apiClient;
