import React, { useEffect, useMemo, useState } from 'react';
import { FiRefreshCcw, FiSearch } from 'react-icons/fi';
import { getCurrentUser } from '../../components/utils/auth';
import { getApiErrorMessage } from '../../services/apiError';
import {
    getAdminUsers,
    updateAdminUserRole,
    updateAdminUserStatus
} from '../../services/adminService';
import './AdminUsers.css';

const roleOptions = ['ALL', 'USER', 'ADMIN'];
const statusOptions = [
    { value: 'ALL', label: 'Tất cả' },
    { value: 'ACTIVE', label: 'Active' },
    { value: 'INACTIVE', label: 'Inactive' }
];

const formatDate = (value) => value ? new Date(value).toLocaleDateString('vi-VN') : 'N/A';

function AdminUsers() {
    const currentUser = getCurrentUser();
    const [users, setUsers] = useState([]);
    const [keyword, setKeyword] = useState('');
    const [role, setRole] = useState('ALL');
    const [status, setStatus] = useState('ALL');
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');
    const [message, setMessage] = useState('');

    const params = useMemo(() => ({
        keyword: keyword.trim() || undefined,
        role: role === 'ALL' ? undefined : role,
        active: status === 'ALL' ? undefined : status === 'ACTIVE'
    }), [keyword, role, status]);

    const loadUsers = async () => {
        setIsLoading(true);
        setError('');

        try {
            const res = await getAdminUsers(params);
            setUsers(res.data || []);
        } catch (err) {
            setError(getApiErrorMessage(err, 'Không thể tải danh sách user.'));
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        loadUsers();
    }, [role, status]);

    const handleSearch = (e) => {
        e.preventDefault();
        loadUsers();
    };

    const handleToggleStatus = async (user) => {
        if (!window.confirm(`${user.active ? 'Khóa' : 'Mở khóa'} tài khoản ${user.username}?`)) return;

        setError('');
        setMessage('');
        try {
            await updateAdminUserStatus(user.id, !user.active);
            setMessage('Cập nhật trạng thái user thành công.');
            await loadUsers();
        } catch (err) {
            setError(getApiErrorMessage(err, 'Không thể cập nhật trạng thái user.'));
        }
    };

    const handleRoleChange = async (user, nextRole) => {
        if (user.role === nextRole) return;
        if (!window.confirm(`Đổi role ${user.username} thành ${nextRole}?`)) return;

        setError('');
        setMessage('');
        try {
            await updateAdminUserRole(user.id, nextRole);
            setMessage('Cập nhật role user thành công.');
            await loadUsers();
        } catch (err) {
            setError(getApiErrorMessage(err, 'Không thể cập nhật role user.'));
        }
    };

    const getAvatar = (user) => {
        return user.avatarUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.username || 'U')}&background=111827&color=fff`;
    };

    return (
        <main className="admin-users-page">
            <div className="admin-page-heading">
                <div>
                    <h1>Quản lý người dùng</h1>
                    <p>Khóa/mở tài khoản và phân quyền USER/ADMIN.</p>
                </div>
                <button type="button" onClick={loadUsers}><FiRefreshCcw /> Làm mới</button>
            </div>

            {error && <div className="admin-alert error">{error}</div>}
            {message && <div className="admin-alert success">{message}</div>}

            <section className="admin-user-toolbar">
                <form className="admin-user-search" onSubmit={handleSearch}>
                    <FiSearch />
                    <input
                        value={keyword}
                        onChange={(e) => setKeyword(e.target.value)}
                        placeholder="Tìm username, tên, email, phone..."
                    />
                    <button type="submit">Tìm</button>
                </form>
                <select value={role} onChange={(e) => setRole(e.target.value)}>
                    {roleOptions.map(item => <option key={item} value={item}>{item === 'ALL' ? 'Tất cả role' : item}</option>)}
                </select>
                <select value={status} onChange={(e) => setStatus(e.target.value)}>
                    {statusOptions.map(item => <option key={item.value} value={item.value}>{item.label}</option>)}
                </select>
            </section>

            <section className="admin-users-card">
                {isLoading && <div className="admin-empty">Đang tải user...</div>}
                {!isLoading && users.length === 0 && <div className="admin-empty">Không có user phù hợp.</div>}

                {!isLoading && users.length > 0 && (
                    <div className="admin-users-table-wrap">
                        <table className="admin-users-table">
                            <thead>
                                <tr>
                                    <th>User</th>
                                    <th>Email</th>
                                    <th>Phone</th>
                                    <th>Role</th>
                                    <th>Status</th>
                                    <th>Created</th>
                                    <th></th>
                                </tr>
                            </thead>
                            <tbody>
                                {users.map(user => {
                                    const isSelf = currentUser?.username === user.username;
                                    return (
                                        <tr key={user.id}>
                                            <td>
                                                <div className="user-cell">
                                                    <img src={getAvatar(user)} alt={user.username} />
                                                    <div>
                                                        <strong>{user.username}</strong>
                                                        <span>{user.fullName || 'Chưa cập nhật tên'}</span>
                                                    </div>
                                                </div>
                                            </td>
                                            <td>{user.email}</td>
                                            <td>{user.phone || 'N/A'}</td>
                                            <td>
                                                <select
                                                    value={user.role}
                                                    onChange={(e) => handleRoleChange(user, e.target.value)}
                                                    disabled={isSelf}
                                                >
                                                    <option value="USER">USER</option>
                                                    <option value="ADMIN">ADMIN</option>
                                                </select>
                                            </td>
                                            <td>
                                                <span className={`admin-badge ${user.active ? 'status-DELIVERED' : 'status-CANCELLED'}`}>
                                                    {user.active ? 'Active' : 'Inactive'}
                                                </span>
                                            </td>
                                            <td>{formatDate(user.createdAt)}</td>
                                            <td>
                                                <button
                                                    type="button"
                                                    className={user.active ? 'danger' : ''}
                                                    disabled={isSelf}
                                                    onClick={() => handleToggleStatus(user)}
                                                >
                                                    {user.active ? 'Khóa' : 'Mở khóa'}
                                                </button>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                )}
            </section>
        </main>
    );
}

export default AdminUsers;
