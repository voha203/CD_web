const BASE_URL = "http://localhost:8080/api";

export const getProducts = async () => {
  const res = await fetch(`${BASE_URL}/products`);
  return res.json();
};