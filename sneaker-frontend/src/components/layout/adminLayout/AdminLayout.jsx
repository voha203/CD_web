import React, { useState } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import {
    FiBarChart2,
    FiGrid,
    FiLayers,
    FiLogOut,
    FiPackage,
    FiPercent,
    FiShoppingBag,
    FiTag,
    FiUsers
} from 'react-icons/fi';
import { getCurrentUser, logout } from '../../utils/auth';
import './AdminLayout.css';

const menuItems = [
    { path: '/admin/dashboard', label: 'Dashboard', icon: <FiBarChart2 /> },
    { path: '/admin/orders', label: 'Orders', icon: <FiShoppingBag /> },
    { path: '/admin/products', label: 'Products', icon: <FiPackage /> },
    { path: '/admin/categories', label: 'Categories', icon: <FiLayers /> },
    { path: '/admin/coupons', label: 'Coupons', icon: <FiTag /> },
    { path: '/admin/discounts', label: 'Discounts', icon: <FiPercent /> },
    { path: '/admin/users', label: 'Users', icon: <FiUsers /> }
];

function AdminLayout() {
    const navigate = useNavigate();
    const currentUser = getCurrentUser();
    const [isNavOpen, setIsNavOpen] = useState(false);

    const handleLogout = () => {
        logout();
        navigate('/login', { replace: true });
    };

    return (
        <div className="admin-shell">
            <aside className={`admin-sidebar ${isNavOpen ? 'open' : ''}`}>
                <button className="admin-brand" type="button" onClick={() => navigate('/admin/dashboard')}>
                    <FiGrid />
                    <span>MySneaker Admin</span>
                </button>

                <nav className="admin-nav">
                    {menuItems.map(item => (
                        item.disabled ? (
                            <span key={item.path} className="admin-nav-link disabled">
                                {item.icon}
                                <span>{item.label}</span>
                            </span>
                        ) : (
                            <NavLink
                                key={item.path}
                                to={item.path}
                                className={({ isActive }) => `admin-nav-link ${isActive ? 'active' : ''}`}
                                onClick={() => setIsNavOpen(false)}
                            >
                                {item.icon}
                                <span>{item.label}</span>
                            </NavLink>
                        )
                    ))}
                </nav>
            </aside>

            <div className="admin-main">
                <header className="admin-topbar">
                    <div>
                        <p>Xin chào</p>
                        <strong>{currentUser?.username || 'ADMIN'}</strong>
                    </div>
                    <button className="admin-nav-toggle" type="button" onClick={() => setIsNavOpen(prev => !prev)}>
                        <FiGrid />
                        Menu
                    </button>
                    <button type="button" onClick={handleLogout}>
                        <FiLogOut />
                        Đăng xuất
                    </button>
                </header>

                <section className="admin-content">
                    <Outlet />
                </section>
            </div>
        </div>
    );
}

export default AdminLayout;
