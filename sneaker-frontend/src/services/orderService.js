import axios from "axios";
import { getToken } from "../components/utils/auth";

const API_URL = "http://localhost:8080/api/orders";

const getAuthHeader = () => {
    const token = getToken();
    return {
        headers: {
            Authorization: `Bearer ${token}`
        }
    };
};

export const placeOrder = (checkoutData) => {
    return axios.post(`${API_URL}/checkout`, checkoutData, getAuthHeader());
};