import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import ScrollToTop from "./components/layout/scrollToTop/ScrollToTop";
import MainLayout from "./pages/MainLayout"

import Home from "./pages/Home/Home";
import ProductList from "./pages/ProductList/ProductList";
import ProductDetail from "./pages/ProductDetail/ProductDetail";
import Cart from "./pages/Cart/Cart"
import Checkout from "./pages/Checkout/Checkout"
import ThankYou from './pages/ThankYou/ThankYou';
import Orders from './pages/Orders/Orders';
import OrderDetail from './pages/OrderDetail/OrderDetail';
import Auth from './pages/Auth/Auth';

import { CartProvider } from './context/CartContext';
import { getCurrentUser, isAuthenticated } from './components/utils/auth';

function App() {
  return (
    <CartProvider>
      <Router>
        <ScrollToTop />

        <Routes>
          {/* Các trang có Header và Footer */}
          <Route element={<MainLayout />}>
            {/* Trang chủ: Mặc định chuyển hướng về danh sách sản phẩm */}
            <Route path="/" element={<Home />} />

            {/* Trang danh sách sản phẩm */}
            <Route path="/products" element={<ProductList />} />

            {/* Trang chi tiết sản phẩm */}
            <Route path="/products/:id" element={<ProductDetail />} />

            {/* Trang giỏ hàng */}
            <Route path="/cart" element={<Cart />} />

            {/* Trang cảm ơn */}
            <Route path="/thank-you" element={<ThankYou />} />

            {/* Trang lịch sử đơn hàng */}
            <Route path="/orders" element={<Orders />} />

            {/* Trang chi tiết đơn hàng */}
            <Route path="/orders/:id" element={<OrderDetail />} />

            {/* Trang 404: Không tải được giao diện */}
            <Route path="*" element={<h1>404 - Not Found</h1>} />
          </Route>

          {/* Các trang không có Header và Footer */}
          {/* Trang đăng nhập */}
          <Route path="/login" element={<Auth />} />

          {/* Trang đăng kí */}
          <Route path="/register" element={<Auth />} />

          {/* Trang thanh toán */}
          <Route path="/checkout" element={<Checkout />} />
        </Routes>
      </Router>
    </CartProvider>
  );
}

export default App;
