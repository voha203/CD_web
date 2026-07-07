import axios from "axios";
import { getToken } from "../components/utils/auth";

const apiClient = axios.create({
    baseURL: "http://localhost:8080/api",
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
