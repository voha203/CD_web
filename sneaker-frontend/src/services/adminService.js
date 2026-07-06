import apiClient from "./apiClient";

export const getDashboardSummary = () => {
    return apiClient.get("/admin/dashboard/summary");
};

export const getRevenueStats = (range = "7d") => {
    return apiClient.get("/admin/dashboard/revenue", { params: { range } });
};

export const getAdminOrders = (params = {}) => {
    return apiClient.get("/admin/orders", { params });
};

export const getAdminOrderById = (id) => {
    return apiClient.get(`/admin/orders/${id}`);
};

export const updateAdminOrderStatus = (id, payload) => {
    return apiClient.patch(`/admin/orders/${id}/status`, payload);
};

export const updateAdminPaymentStatus = (id, payload) => {
    return apiClient.patch(`/admin/orders/${id}/payment-status`, payload);
};

export const confirmAdminRefund = (id) => {
    return apiClient.patch(`/admin/orders/${id}/confirm-refund`);
};

export const getAdminProducts = (params = {}) => {
    return apiClient.get("/admin/products", { params });
};

export const getAdminProductById = (id) => {
    return apiClient.get(`/admin/products/${id}`);
};

export const createAdminProduct = (payload) => {
    return apiClient.post("/admin/products", payload);
};

export const updateAdminProduct = (id, payload) => {
    return apiClient.put(`/admin/products/${id}`, payload);
};

export const updateAdminProductStatus = (id, active) => {
    return apiClient.patch(`/admin/products/${id}/status`, { active });
};

export const getAdminCategories = (params = {}) => {
    return apiClient.get("/admin/categories", { params });
};

export const createAdminCategory = (payload) => {
    return apiClient.post("/admin/categories", payload);
};

export const updateAdminCategory = (id, payload) => {
    return apiClient.put(`/admin/categories/${id}`, payload);
};

export const updateAdminCategoryStatus = (id, active) => {
    return apiClient.patch(`/admin/categories/${id}/status`, { active });
};

export const getAdminUsers = (params = {}) => {
    return apiClient.get("/admin/users", { params });
};

export const getAdminUserById = (id) => {
    return apiClient.get(`/admin/users/${id}`);
};

export const updateAdminUserStatus = (id, active) => {
    return apiClient.patch(`/admin/users/${id}/status`, { active });
};

export const updateAdminUserRole = (id, role) => {
    return apiClient.patch(`/admin/users/${id}/role`, { role });
};

export const getSizes = () => {
    return apiClient.get("/sizes");
};
