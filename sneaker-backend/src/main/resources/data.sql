INSERT INTO products (id, name, brand, price) VALUES (1, 'Air Force 1', 'Nike', 3000000);

INSERT INTO sizes (id, value) VALUES (1, '40'), (2, '41');

-- variant
INSERT INTO product_variants (id, product_id, color, sku) VALUES (1, 1, 'White', 'AF1-WHITE');

INSERT INTO `product_images` (`id`, `variant_id`, `image_url`, `is_main`) VALUES
                                                                              (1, 1, 'https://static.nike.com/a/images/t_web_pdp_936_v2/f_auto,u_9ddf04c7-2a9a-4d76-add1-d15af8f0263d,c_scale,fl_relative,w_1.0,h_1.0,fl_layer_apply/b7d9211c-26e7-431a-ac24-b0540fb3c00f/AIR+FORCE+1+%2707.png', b'1'),
                                                                              (2, 1, 'https://static.nike.com/a/images/t_web_pdp_936_v2/f_auto,u_9ddf04c7-2a9a-4d76-add1-d15af8f0263d,c_scale,fl_relative,w_1.0,h_1.0,fl_layer_apply/00375837-849f-4f17-ba24-d201d27be49b/AIR+FORCE+1+%2707.png', b'0');

-- variant_size
INSERT INTO product_variant_sizes (id, variant_id, size_id, quantity)
VALUES (10, 1, 1, 50);

-- user (chỉ dùng khi test giỏ hàng / tạo user bằng api)
INSERT INTO users (id, username, password) VALUES (1, 'anhtu13579', '12345');

-- cart
INSERT INTO carts (id, user_id) VALUES (1, 1);

-- cart_item
INSERT INTO cart_items (id, cart_id, variant_size_id, quantity) VALUES (1, 1, 10, 2);

------------------------------ TEST CART API (GIỎ HÀNG) ------------------------------
-- Lấy giỏ hàng: GET http://localhost:8080/api/cart

-- Thêm sản phẩm vào giỏ: POST http://localhost:8080/api/cart
-- {
--   "variantSizeId": 10,
--   "quantity": 2
-- }

-- Cập nhật số lượng: PUT http://localhost:8080/api/cart/1?quantity=5

-- Xóa 1 item: DELETE http://localhost:8080/api/cart/1

-- Clear cart: DELETE http://localhost:8080/api/cart/clear


------------------------------ TEST CART API (TRANG THANH TOÁN) ------------------------------
-- Chuyển dữ liệu từ giỏ hàng sang trang thanh toán: POST http://localhost:8080/api/orders/checkout
-- {
--     "userId": 1,
--     "receiverName": "Nguyễn Văn A",
--     "receiverPhone": "0901234567",
--     "shippingAddress": "123 Đường ABC, Quận 1, TP.HCM",
--     "paymentMethod": "COD",
--     "note": "Giao hàng giờ hành chính giúp mình nhé!"
-- }