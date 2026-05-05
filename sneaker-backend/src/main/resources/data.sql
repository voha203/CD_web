INSERT INTO products (id, name, brand, price) VALUES (1, 'Air Force 1', 'Nike', 3000000);

INSERT INTO sizes (id, value) VALUES (1, '40'), (2, '41');

-- variant
INSERT INTO product_variants (id, product_id, color, sku) VALUES (1, 1, 'White', 'AF1-WHITE');

-- variant_size
INSERT INTO product_variant_sizes (id, variant_id, size_id, quantity)
VALUES (10, 1, 1, 50);

INSERT INTO users (id, username, password) VALUES (1, 'anhtu13579', '12345');


------------------------------ TEST CART API ------------------------------
-- Lấy giỏ hàng: GET http://localhost:8080/api/cart

-- Thêm sản phẩm vào giỏ: POST http://localhost:8080/api/cart
-- {
--   "variantSizeId": 10,
--   "quantity": 2
-- }

-- Cập nhật số lượng: PUT http://localhost:8080/api/cart/1?quantity=5

-- Xóa 1 item: DELETE http://localhost:8080/api/cart/1

-- Clear cart: DELETE http://localhost:8080/api/cart/clear