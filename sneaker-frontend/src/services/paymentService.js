import axios from "axios";
import { getToken } from "../components/utils/auth";

const API_URL = "http://localhost:8080/api/payment";

const getAuthHeader = () => {
    const token = getToken();
    if (!token) return {};

    return {
        headers: {
            Authorization: `Bearer ${token}`
        }
    };
};

export const createPaymentUrl = (orderId, bankCode) => {
    const params = new URLSearchParams({ orderId });

    if (bankCode) {
        params.append("bankCode", bankCode);
    }

    return axios.get(`${API_URL}/create-url?${params.toString()}`, getAuthHeader());
};
