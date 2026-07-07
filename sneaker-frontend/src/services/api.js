import apiClient from "./apiClient";
import { createApiError } from "./apiError";
import { API_BASE_URL } from "../config/apiConfig";

const BASE_URL = API_BASE_URL;

const fetchJson = async (url, options, fallback) => {
  const res = await fetch(url, options);

  if (!res.ok) {
    throw await createApiError(res, fallback);
  }

  return res.json();
};

export const getProducts = async (params = {}) => {
  const query = new URLSearchParams();

  Object.entries(params).forEach(([key, value]) => {
    if (value === undefined || value === null || value === "") return;
    if (Array.isArray(value)) {
      if (value.length > 0) query.append(key, value.join(","));
      return;
    }
    query.append(key, value);
  });

  const suffix = query.toString() ? `?${query.toString()}` : "";
  return fetchJson(`${BASE_URL}/products${suffix}`, undefined, "Không thể tải danh sách sản phẩm");
};

export const getProductSuggestions = async (keyword) => {
  if (!keyword || !keyword.trim()) return [];

  try {
    return await fetchJson(
      `${BASE_URL}/products/suggestions?keyword=${encodeURIComponent(keyword.trim())}`,
      undefined,
      "Không thể tải gợi ý tìm kiếm"
    );
  } catch (error) {
    console.error("Lỗi khi lấy gợi ý tìm kiếm:", error);
    return [];
  }
};

export const getProductById = async (id) => {
  return fetchJson(`${BASE_URL}/products/${id}`, undefined, "Không thể tải chi tiết sản phẩm");
};

export const getProductReviews = async (id, page = 0, size = 5) => {
  return fetchJson(
    `${BASE_URL}/products/${id}/reviews?page=${page}&size=${size}`,
    undefined,
    "Không thể tải đánh giá"
  );
};

export const getProductReviewSummary = async (id) => {
  return fetchJson(`${BASE_URL}/products/${id}/reviews/summary`, undefined, "Không thể tải tổng quan đánh giá");
};

export const submitProductReview = async (id, reviewData) => {
  const res = await apiClient.post(`/products/${id}/reviews`, reviewData);
  return res.data;
};

export const canReviewProduct = async (id) => {
  const res = await apiClient.get(`/reviews/can-review/${id}`);
  return res.data;
};

export const updateProductReview = async (reviewId, reviewData) => {
  const res = await apiClient.put(`/reviews/${reviewId}`, reviewData);
  return res.data;
};

export const deleteProductReview = async (reviewId) => {
  const res = await apiClient.delete(`/reviews/${reviewId}`);
  return res.data;
};
