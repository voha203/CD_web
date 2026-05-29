const BASE_URL = "http://localhost:8080/api";

// Lấy danh sách sản phẩm
export const getProducts = async () => {
  const res = await fetch(`${BASE_URL}/products`);
  return res.json();
};

// Lấy danh sách sản phẩm gợi ý dựa trên từ khóa người dùng gõ
export const getProductSuggestions = async (keyword) => {
  if (!keyword || !keyword.trim()) return [];

  try {
    const res = await fetch(`${BASE_URL}/products/suggestions?keyword=${encodeURIComponent(keyword.trim())}`);
    if (!res.ok) throw new Error("Network response was not ok");
    return await res.json();
  } catch (error) {
    console.error("Lỗi khi lấy gợi ý tìm kiếm:", error);
    return [];
  }
};

// Lấy chi tiết sản phẩm theo ID (trang chi tiết sản phẩm)
export const getProductById = async (id) => {
  const res = await fetch(`${BASE_URL}/products/${id}`);
  if (!res.ok) throw new Error("Lỗi khi lấy chi tiết sản phẩm");
  return res.json();
};

// Lấy danh sách đánh giá theo trang (trang chi tiết sản phẩm)
export const getProductReviews = async (id, page = 0, size = 5) => {
  const res = await fetch(`${BASE_URL}/products/${id}/reviews?page=${page}&size=${size}`);
  if (!res.ok) throw new Error("Lỗi khi lấy đánh giá");
  return res.json();
};

// Gửi đánh giá mới (trang chi tiết sản phẩm)
export const submitProductReview = async (id, reviewData) => {
  const res = await fetch(`${BASE_URL}/products/${id}/reviews`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(reviewData)
  });
  
  if (!res.ok) throw new Error("Lỗi khi gửi đánh giá");
  return res; 
};