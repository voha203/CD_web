import apiClient from "./apiClient";

export const createPaymentUrl = (orderId, bankCode) => {
    const params = new URLSearchParams({ orderId });

    if (bankCode) {
        params.append("bankCode", bankCode);
    }

    return apiClient.get(`/payment/create-url?${params.toString()}`);
};
