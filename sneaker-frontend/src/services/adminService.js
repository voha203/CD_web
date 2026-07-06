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
