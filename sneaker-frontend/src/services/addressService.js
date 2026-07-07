import axios from 'axios';

const API_URL = 'http://localhost:8080/api/addresses';

const authHeaders = () => {
    const token = localStorage.getItem('token');
    return token ? { Authorization: `Bearer ${token}` } : {};
};

export const getAddresses = () => axios.get(API_URL, { headers: authHeaders() });

export const getAddressById = (id) => axios.get(`${API_URL}/${id}`, { headers: authHeaders() });

export const createAddress = (data) => axios.post(API_URL, data, { headers: authHeaders() });

export const updateAddress = (id, data) => axios.put(`${API_URL}/${id}`, data, { headers: authHeaders() });

export const deleteAddress = (id) => axios.delete(`${API_URL}/${id}`, { headers: authHeaders() });

export const setDefaultAddress = (id) => axios.patch(`${API_URL}/${id}/default`, {}, { headers: authHeaders() });
