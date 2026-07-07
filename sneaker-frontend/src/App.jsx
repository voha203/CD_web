import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import ScrollToTop from "./components/layout/scrollToTop/ScrollToTop";
import MainLayout from "./pages/MainLayout"

import Home from "./pages/Home/Home";
import ProductList from "./pages/ProductList/ProductList";
import ProductDetail from "./pages/productDetail/ProductDetail";
import Cart from "./pages/Cart/Cart"
import Checkout from "./pages/Checkout/Checkout"
import ThankYou from './pages/ThankYou/ThankYou';
import Orders from './pages/Orders/Orders';
import OrderDetail from './pages/OrderDetail/OrderDetail';
import Auth from './pages/Auth/Auth';
import OAuth2Redirect from './pages/Auth/OAuth2Redirect';
import ChangePassword from './pages/ChangePassword/ChangePassword';
import AdminCoupons from './pages/AdminCoupons/AdminCoupons';
import AdminDiscounts from './pages/AdminDiscounts/AdminDiscounts';
import AdminDashboard from './pages/AdminDashboard/AdminDashboard';
import AdminOrders from './pages/AdminOrders/AdminOrders';
import AdminProducts from './pages/AdminProducts/AdminProducts';
import AdminCategories from './pages/AdminCategories/AdminCategories';
import AdminUsers from './pages/AdminUsers/AdminUsers';
import Profile from './pages/Profile/Profile';
import Wishlist from './pages/Wishlist/Wishlist';
import AdminLayout from './components/layout/adminLayout/AdminLayout';
import ErrorPage from './pages/ErrorPage/ErrorPage';

import { CartProvider } from './context/CartContext';
import { getCurrentUser, isAuthenticated } from './components/utils/auth';

function normalizeRole(role) {
  if (!role) return "";
  return role.toUpperCase().replace("ROLE_", "");
}

function ProtectedRoute({ children, roles }) {
  const location = useLocation();

  if (!isAuthenticated()) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  if (roles?.length) {
    const userRole = normalizeRole(getCurrentUser()?.role);

    if (!roles.includes(userRole)) {
      return <Navigate to="/403" replace />;
    }
  }

  return children;
}

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
            <Route path="/cart" element={<ProtectedRoute roles={["USER"]}><Cart /></ProtectedRoute>} />

            {/* Trang cảm ơn */}
            <Route path="/thank-you" element={<ThankYou />} />

            {/* Trang lịch sử đơn hàng */}
            <Route path="/orders" element={<ProtectedRoute roles={["USER"]}><Orders /></ProtectedRoute>} />

            {/* Trang chi tiết đơn hàng */}
            <Route path="/orders/:id" element={<ProtectedRoute roles={["USER"]}><OrderDetail /></ProtectedRoute>} />
            <Route path="/wishlist" element={<ProtectedRoute roles={["USER"]}><Wishlist /></ProtectedRoute>} />
            <Route path="/profile" element={<ProtectedRoute roles={["USER"]}><Profile /></ProtectedRoute>} />
            <Route path="/change-password" element={<ProtectedRoute roles={["USER"]}><ChangePassword /></ProtectedRoute>} />
            {/* Trang 404: Không tải được giao diện */}
            <Route path="/403" element={<ErrorPage code={403} />} />
            <Route path="/500" element={<ErrorPage code={500} />} />
            <Route path="*" element={<ErrorPage code={404} />} />
          </Route>

          {/* Các trang không có Header và Footer */}
          {/* Trang thanh toán */}
          <Route path="/admin" element={<ProtectedRoute roles={["ADMIN"]}><AdminLayout /></ProtectedRoute>}>
            <Route index element={<Navigate to="/admin/dashboard" replace />} />
            <Route path="dashboard" element={<AdminDashboard />} />
            <Route path="orders" element={<AdminOrders />} />
            <Route path="products" element={<AdminProducts />} />
            <Route path="categories" element={<AdminCategories />} />
            <Route path="coupons" element={<AdminCoupons />} />
            <Route path="discounts" element={<AdminDiscounts />} />
            <Route path="users" element={<AdminUsers />} />
          </Route>

          <Route path="/login" element={<Auth />} />
          <Route path="/register" element={<Auth />} />
          <Route path="/oauth2/redirect" element={<OAuth2Redirect />} />

          <Route path="/checkout" element={<ProtectedRoute roles={["USER"]}><Checkout /></ProtectedRoute>} />
        </Routes>
      </Router>
    </CartProvider>
  );
}

export default App;
