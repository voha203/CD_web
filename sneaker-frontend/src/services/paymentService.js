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

export const createPaymentUrl = (orderId) => {
    return axios.get(`${API_URL}/create-url?orderId=${orderId}`, getAuthHeader());
};
