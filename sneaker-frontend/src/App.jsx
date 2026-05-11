import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Header from './components/layout/header/Header'
import Footer from './components/layout/header/Header'

import Home from "./pages/Home/Home";
import ProductList from "./pages/ProductList/ProductList";
import ProductDetail from "./pages/productDetail/ProductDetail";
import Cart from "./pages/Cart/Cart"

function App() {
  return (
    <Router>
      <Routes>
          {/* Trang chủ: Mặc định chuyển hướng về danh sách sản phẩm */}
          <Route path="/" element={<Home />} />

          {/* Trang danh sách sản phẩm */}
          <Route path="/products" element={<ProductList />} />

          {/* Trang chi tiết sản phẩm */}
          <Route path="/products/:id" element={<ProductDetail />} />

          {/* Trang giỏ hàng */}
          <Route path="/cart" element={<Cart />} />

          {/* Trang 404: Không tải được giao diện */}
          <Route path="*" element={<h1>404 - Not Found</h1>} />

      </Routes>
    </Router>
  );
}

export default App;