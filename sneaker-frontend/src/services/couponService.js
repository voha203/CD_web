import apiClient from "./apiClient";

export const validateCoupon = (couponCode) => {
    return apiClient.post("/coupons/validate", { couponCode });
};

export const getAdminCoupons = () => {
    return apiClient.get("/admin/coupons");
};

export const getAdminCouponById = (id) => {
    return apiClient.get(`/admin/coupons/${id}`);
};

export const createAdminCoupon = (payload) => {
    return apiClient.post("/admin/coupons", payload);
};

export const updateAdminCoupon = (id, payload) => {
    return apiClient.put(`/admin/coupons/${id}`, payload);
};

export const toggleAdminCoupon = (id) => {
    return apiClient.patch(`/admin/coupons/${id}/toggle`);
};

export const deleteAdminCoupon = (id) => {
    return apiClient.delete(`/admin/coupons/${id}`);
};
