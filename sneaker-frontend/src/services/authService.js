import axios from "axios";
import { getToken } from "../components/utils/auth";

const API_URL = "http://localhost:8080/api/auth";

export const getProfile = () => {
    const token = getToken();

    if (!token) return Promise.reject("No token found");
    
    return axios.get(`${API_URL}/profile`, {
        headers: { Authorization: `Bearer ${token}` }
    });
};