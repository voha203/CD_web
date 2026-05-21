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