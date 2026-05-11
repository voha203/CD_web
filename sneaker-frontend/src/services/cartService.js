import axios from "axios";

const API_URL = "http://localhost:8080/api/cart";

const getToken = () => {
    // return localStorage.getItem("token");
    // Sử dụng token được tạo sẵn
    return "eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJhZG1pbiIsImlhdCI6MTc3ODA2OTk0MCwiZXhwIjoxNzc4MTU2MzQwfQ.BqxTZ9xPYOJbIKQ1MhDASXjZ0iJMUSZESTcEhvZTj3w";
};

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