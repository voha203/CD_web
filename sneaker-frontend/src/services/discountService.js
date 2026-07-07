import apiClient from "./apiClient";

export const getActiveDiscounts = () => {
    return apiClient.get("/discounts/active");
};

export const getProductDiscounts = (productId) => {
    return apiClient.get(`/discounts/product/${productId}`);
};

export const getSaleProducts = () => {
    return apiClient.get("/products/sale");
};

export const getAdminDiscounts = () => {
    return apiClient.get("/admin/discounts");
};

export const getAdminDiscountById = (id) => {
    return apiClient.get(`/admin/discounts/${id}`);
};

export const createAdminDiscount = (payload) => {
    return apiClient.post("/admin/discounts", payload);
};

export const updateAdminDiscount = (id, payload) => {
    return apiClient.put(`/admin/discounts/${id}`, payload);
};

export const toggleAdminDiscount = (id) => {
    return apiClient.patch(`/admin/discounts/${id}/toggle`);
};

export const deleteAdminDiscount = (id) => {
    return apiClient.delete(`/admin/discounts/${id}`);
};
