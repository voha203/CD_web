import apiClient from './apiClient';

export const getWishlist = () => apiClient.get('/wishlist');

export const addWishlistItem = (productId) => apiClient.post(`/wishlist/${productId}`);

export const removeWishlistItem = (productId) => apiClient.delete(`/wishlist/${productId}`);

export const checkWishlistItem = (productId) => apiClient.get(`/wishlist/check/${productId}`);
