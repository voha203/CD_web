import axios from "axios";
import { getToken } from "../components/utils/auth";

const API_URL = "http://localhost:8080/api/orders";

const getAuthHeader = () => {
    const token = getToken();
    if (!token) return {};

    return {
        headers: {
            Authorization: `Bearer ${token}`
        }
    };
};

export const placeOrder = (checkoutData) => {
    return axios.post(`${API_URL}/checkout`, checkoutData, getAuthHeader());
};

export const getOrderById = (orderId) => {
    return axios.get(`${API_URL}/${orderId}`, getAuthHeader());
};

export const getMyOrders = () => {
    return axios.get(API_URL, getAuthHeader());
};
