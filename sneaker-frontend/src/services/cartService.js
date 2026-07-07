import apiClient from "./apiClient";

export const getCart = () => {
    return apiClient.get("/cart");
};

export const addToCart = ({ variantSizeId, quantity = 1 }) => {
    return apiClient.post("/cart/add", { variantSizeId, quantity });
};

export const updateQuantity = (itemId, quantity) => {
    return apiClient.put(`/cart/${itemId}?quantity=${quantity}`, {});
};

export const deleteItem = (itemId) => {
    return apiClient.delete(`/cart/${itemId}`);
};

export const clearCart = () => {
    return apiClient.delete("/cart/clear");
};
