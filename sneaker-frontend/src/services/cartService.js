import axios from "axios";
import { getToken } from "../components/utils/auth";

const API_URL = "http://localhost:8080/api/cart";

const getAuthHeader = () => {
    const token = getToken();
    return {
        headers: {
            Authorization: `Bearer ${token}`
        }
    };
};

export const getCart = () => {
    return axios.get(`${API_URL}`, getAuthHeader());
};

export const updateQuantity = (itemId, quantity) => {
    return axios.put(`${API_URL}/${itemId}?quantity=${quantity}`, {}, getAuthHeader());
};

export const deleteItem = (itemId) => {
    return axios.delete(`${API_URL}/${itemId}`, getAuthHeader());
};

export const clearCart = () => {
    return axios.delete(`${API_URL}/clear`, getAuthHeader());
};