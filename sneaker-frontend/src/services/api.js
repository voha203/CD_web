import { createApiError } from "./apiError";

const BASE_URL = "http://localhost:8080/api";

const fetchJson = async (url, options, fallback) => {
  const res = await fetch(url, options);

  if (!res.ok) {
    throw await createApiError(res, fallback);
  }

  return res.json();
};

export const getProducts = async () => {
  return fetchJson(`${BASE_URL}/products`, undefined, "Không thể tải danh sách sản phẩm");
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

export const submitProductReview = async (id, reviewData) => {
  return fetchJson(
    `${BASE_URL}/products/${id}/reviews`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(reviewData)
    },
    "Không thể gửi đánh giá"
  );
};
