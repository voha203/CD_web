import apiClient from "./apiClient";

export const placeOrder = (checkoutData) => {
    return apiClient.post("/orders/checkout", checkoutData);
};

export const getOrderById = (orderId) => {
    return apiClient.get(`/orders/${orderId}`);
};

export const getMyOrders = () => {
    return apiClient.get("/orders");
};

export const cancelOrder = (orderId, reason) => {
    return apiClient.post(`/orders/${orderId}/cancel`, { reason });
};
