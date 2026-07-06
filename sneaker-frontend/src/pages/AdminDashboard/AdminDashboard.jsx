import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiCreditCard, FiPackage, FiRefreshCcw, FiShoppingBag, FiUsers } from 'react-icons/fi';
import { getApiErrorMessage } from '../../services/apiError';
import { getAdminOrders, getDashboardSummary, getRevenueStats } from '../../services/adminService';
import './AdminDashboard.css';

const formatMoney = (value) => `${Number(value || 0).toLocaleString('vi-VN')}₫`;
const formatDate = (value) => value ? new Date(value).toLocaleString('vi-VN') : 'N/A';

function AdminDashboard() {
    const navigate = useNavigate();
    const [summary, setSummary] = useState(null);
    const [revenue, setRevenue] = useState([]);
    const [recentOrders, setRecentOrders] = useState([]);
    const [range, setRange] = useState('7d');
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');

    const loadDashboard = async (selectedRange = range) => {
        setIsLoading(true);
        setError('');

        try {
            const [summaryRes, revenueRes, ordersRes] = await Promise.all([
                getDashboardSummary(),
                getRevenueStats(selectedRange),
                getAdminOrders()
            ]);

            setSummary(summaryRes.data);
            setRevenue(revenueRes.data || []);
            setRecentOrders((ordersRes.data || []).slice(0, 8));
        } catch (err) {
            setError(getApiErrorMessage(err, 'Không thể tải dữ liệu dashboard.'));
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        loadDashboard(range);
    }, []);

    const maxRevenue = useMemo(() => {
        return Math.max(...revenue.map(item => item.revenue || 0), 1);
    }, [revenue]);

    const cards = [
        { label: 'Tổng doanh thu', value: formatMoney(summary?.totalRevenue), icon: <FiCreditCard />, tone: 'revenue' },
        { label: 'Tổng đơn hàng', value: summary?.totalOrders || 0, icon: <FiShoppingBag />, tone: 'orders' },
        { label: 'Tổng user', value: summary?.totalUsers || 0, icon: <FiUsers />, tone: 'users' },
        { label: 'Tổng sản phẩm', value: summary?.totalProducts || 0, icon: <FiPackage />, tone: 'products' },
        { label: 'Đơn chờ xử lý', value: summary?.pendingOrders || 0, icon: <FiShoppingBag />, tone: 'pending' },
        { label: 'Đơn chờ hoàn tiền', value: summary?.refundPendingOrders || 0, icon: <FiRefreshCcw />, tone: 'refund' }
    ];

    const handleRangeChange = async (nextRange) => {
        setRange(nextRange);
        setError('');

        try {
            const res = await getRevenueStats(nextRange);
            setRevenue(res.data || []);
        } catch (err) {
            setError(getApiErrorMessage(err, 'Không thể tải doanh thu.'));
        }
    };

    return (
        <main className="admin-dashboard-page">
            <div className="admin-page-heading">
                <div>
                    <h1>Dashboard</h1>
                    <p>Tổng quan doanh thu, đơn hàng và trạng thái vận hành.</p>
                </div>
                <button type="button" onClick={() => loadDashboard(range)} disabled={isLoading}>
                    Làm mới
                </button>
            </div>

            {error && <div className="admin-alert error">{error}</div>}
            {isLoading && <div className="admin-loading">Đang tải dashboard...</div>}

            {!isLoading && summary && (
                <>
                    <section className="dashboard-card-grid">
                        {cards.map(card => (
                            <article key={card.label} className={`dashboard-card ${card.tone}`}>
                                <div className="dashboard-card-icon">{card.icon}</div>
                                <span>{card.label}</span>
                                <strong>{card.value}</strong>
                            </article>
                        ))}
                    </section>

                    <section className="dashboard-panels">
                        <div className="dashboard-panel">
                            <div className="panel-heading">
                                <h2>Doanh thu</h2>
                                <div className="range-tabs">
                                    {['7d', '30d', 'month'].map(item => (
                                        <button
                                            key={item}
                                            type="button"
                                            className={range === item ? 'active' : ''}
                                            onClick={() => handleRangeChange(item)}
                                        >
                                            {item === 'month' ? '12 tháng' : item}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div className="revenue-list">
                                {revenue.map(item => (
                                    <div key={item.label} className="revenue-row">
                                        <span>{item.label}</span>
                                        <div className="revenue-bar-wrap">
                                            <div
                                                className="revenue-bar"
                                                style={{ width: `${Math.max((item.revenue / maxRevenue) * 100, item.revenue > 0 ? 4 : 0)}%` }}
                                            />
                                        </div>
                                        <strong>{formatMoney(item.revenue)}</strong>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="dashboard-panel">
                            <div className="panel-heading">
                                <h2>Đơn hàng gần đây</h2>
                                <button type="button" onClick={() => navigate('/admin/orders')}>Xem tất cả</button>
                            </div>

                            <div className="recent-order-list">
                                {recentOrders.length === 0 && <div className="admin-empty">Chưa có đơn hàng.</div>}
                                {recentOrders.map(order => (
                                    <button
                                        type="button"
                                        key={order.orderId}
                                        className="recent-order-item"
                                        onClick={() => navigate(`/admin/orders?orderId=${order.orderId}`)}
                                    >
                                        <div>
                                            <strong>#MS-{order.orderId}</strong>
                                            <span>{order.username} - {order.receiverName}</span>
                                        </div>
                                        <div>
                                            <strong>{formatMoney(order.finalAmount || order.totalAmount)}</strong>
                                            <span>{formatDate(order.createdAt)}</span>
                                        </div>
                                    </button>
                                ))}
                            </div>
                        </div>
                    </section>
                </>
            )}
        </main>
    );
}

export default AdminDashboard;
