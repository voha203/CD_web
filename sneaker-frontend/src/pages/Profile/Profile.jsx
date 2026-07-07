import React, { useEffect, useMemo, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { FiLock, FiLogOut, FiMapPin, FiPackage, FiSave, FiShield, FiUser } from 'react-icons/fi';
import { changeProfilePassword, getProfile, updateProfile } from '../../services/profileService';
import { createAddress, deleteAddress, getAddresses, setDefaultAddress, updateAddress } from '../../services/addressService';
import { getApiErrorMessage } from '../../services/apiError';
import { logout, updateStoredUser } from '../../components/utils/auth';
import './Profile.css';

const emptyProfile = {
    username: '',
    fullName: '',
    email: '',
    phone: '',
    address: '',
    avatarUrl: '',
    role: 'USER'
};

const emptyPasswordForm = {
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
};

const emptyAddressForm = {
    receiverName: '',
    receiverPhone: '',
    province: '',
    district: '',
    ward: '',
    detailAddress: '',
    isDefault: false
};

const tabs = [
    { key: 'personal', label: 'Thông tin cá nhân', icon: <FiUser /> },
    { key: 'contact', label: 'Địa chỉ / liên hệ', icon: <FiMapPin /> },
    { key: 'security', label: 'Bảo mật', icon: <FiShield /> },
    { key: 'orders', label: 'Đơn hàng của tôi', icon: <FiPackage /> }
];

function Profile() {
    const navigate = useNavigate();
    const location = useLocation();
    const [activeTab, setActiveTab] = useState(location.state?.tab || 'personal');
    const [profile, setProfile] = useState(emptyProfile);
    const [passwordForm, setPasswordForm] = useState(emptyPasswordForm);
    const [isLoading, setIsLoading] = useState(true);
    const [isSavingProfile, setIsSavingProfile] = useState(false);
    const [isChangingPassword, setIsChangingPassword] = useState(false);
    const [profileMessage, setProfileMessage] = useState('');
    const [profileError, setProfileError] = useState('');
    const [passwordMessage, setPasswordMessage] = useState('');
    const [passwordError, setPasswordError] = useState('');
    const [addresses, setAddresses] = useState([]);
    const [addressForm, setAddressForm] = useState(emptyAddressForm);
    const [editingAddressId, setEditingAddressId] = useState(null);
    const [isAddressLoading, setIsAddressLoading] = useState(false);
    const [isSavingAddress, setIsSavingAddress] = useState(false);
    const [addressMessage, setAddressMessage] = useState('');
    const [addressError, setAddressError] = useState('');

    const initials = useMemo(() => {
        const source = profile.fullName || profile.username || 'U';
        return source
            .split(' ')
            .filter(Boolean)
            .slice(0, 2)
            .map(part => part[0])
            .join('')
            .toUpperCase();
    }, [profile.fullName, profile.username]);

    useEffect(() => {
        let active = true;

        const loadProfile = async () => {
            setIsLoading(true);
            setProfileError('');

            try {
                const res = await getProfile();
                if (!active) return;

                const data = res.data || {};
                setProfile({ ...emptyProfile, ...data });
                updateStoredUser(data);
            } catch (err) {
                if (active) {
                    setProfileError(getApiErrorMessage(err, 'Không thể tải hồ sơ tài khoản.'));
                }
            } finally {
                if (active) {
                    setIsLoading(false);
                }
            }
        };

        loadProfile();

        return () => {
            active = false;
        };
    }, []);

    const loadAddresses = async () => {
        setIsAddressLoading(true);
        setAddressError('');

        try {
            const res = await getAddresses();
            setAddresses(res.data || []);
        } catch (err) {
            setAddressError(getApiErrorMessage(err, 'Không thể tải địa chỉ giao hàng.'));
        } finally {
            setIsAddressLoading(false);
        }
    };

    useEffect(() => {
        loadAddresses();
    }, []);

    useEffect(() => {
        if (location.state?.tab) {
            setActiveTab(location.state.tab);
        }
    }, [location.state]);

    const handleProfileChange = (e) => {
        const { name, value } = e.target;
        setProfile(prev => ({ ...prev, [name]: value }));
        setProfileMessage('');
        setProfileError('');
    };

    const handlePasswordChange = (e) => {
        const { name, value } = e.target;
        setPasswordForm(prev => ({ ...prev, [name]: value }));
        setPasswordMessage('');
        setPasswordError('');
    };

    const handleAddressChange = (e) => {
        const { name, value, type, checked } = e.target;
        setAddressForm(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
        setAddressMessage('');
        setAddressError('');
    };

    const handleEditAddress = (address) => {
        setEditingAddressId(address.id);
        setAddressForm({
            receiverName: address.receiverName || '',
            receiverPhone: address.receiverPhone || '',
            province: address.province || '',
            district: address.district || '',
            ward: address.ward || '',
            detailAddress: address.detailAddress || '',
            isDefault: Boolean(address.isDefault)
        });
        setAddressMessage('');
        setAddressError('');
    };

    const resetAddressForm = () => {
        setEditingAddressId(null);
        setAddressForm(emptyAddressForm);
    };

    const handleSaveAddress = async (e) => {
        e.preventDefault();
        setIsSavingAddress(true);
        setAddressMessage('');
        setAddressError('');

        try {
            if (editingAddressId) {
                await updateAddress(editingAddressId, addressForm);
                setAddressMessage('Cập nhật địa chỉ thành công.');
            } else {
                await createAddress(addressForm);
                setAddressMessage('Thêm địa chỉ thành công.');
            }
            resetAddressForm();
            await loadAddresses();
        } catch (err) {
            setAddressError(getApiErrorMessage(err, 'Không thể lưu địa chỉ giao hàng.'));
        } finally {
            setIsSavingAddress(false);
        }
    };

    const handleDeleteAddress = async (id) => {
        if (!window.confirm('Bạn muốn xóa địa chỉ này?')) return;
        setIsSavingAddress(true);
        setAddressMessage('');
        setAddressError('');

        try {
            await deleteAddress(id);
            setAddressMessage('Xóa địa chỉ thành công.');
            await loadAddresses();
        } catch (err) {
            setAddressError(getApiErrorMessage(err, 'Không thể xóa địa chỉ.'));
        } finally {
            setIsSavingAddress(false);
        }
    };

    const handleSetDefaultAddress = async (id) => {
        setIsSavingAddress(true);
        setAddressMessage('');
        setAddressError('');

        try {
            await setDefaultAddress(id);
            setAddressMessage('Đã đặt địa chỉ mặc định.');
            await loadAddresses();
        } catch (err) {
            setAddressError(getApiErrorMessage(err, 'Không thể đặt địa chỉ mặc định.'));
        } finally {
            setIsSavingAddress(false);
        }
    };

    const handleSaveProfile = async (e) => {
        e.preventDefault();
        setIsSavingProfile(true);
        setProfileMessage('');
        setProfileError('');

        try {
            const payload = {
                fullName: profile.fullName,
                email: profile.email,
                phone: profile.phone,
                address: profile.address,
                avatarUrl: profile.avatarUrl
            };

            const res = await updateProfile(payload);
            const updatedProfile = { ...emptyProfile, ...(res.data || {}) };
            setProfile(updatedProfile);
            updateStoredUser(updatedProfile);
            setProfileMessage('Cập nhật hồ sơ thành công.');
        } catch (err) {
            setProfileError(getApiErrorMessage(err, 'Không thể cập nhật hồ sơ.'));
        } finally {
            setIsSavingProfile(false);
        }
    };

    const handleChangePassword = async (e) => {
        e.preventDefault();
        setPasswordMessage('');
        setPasswordError('');

        if (passwordForm.newPassword !== passwordForm.confirmPassword) {
            setPasswordError('Mật khẩu xác nhận không khớp.');
            return;
        }

        setIsChangingPassword(true);

        try {
            await changeProfilePassword({
                oldPassword: passwordForm.currentPassword,
                newPassword: passwordForm.newPassword,
                confirmPassword: passwordForm.confirmPassword
            });
            setPasswordForm(emptyPasswordForm);
            setPasswordMessage('Đổi mật khẩu thành công. Bạn có thể dùng mật khẩu mới ở lần đăng nhập sau.');
        } catch (err) {
            setPasswordError(getApiErrorMessage(err, 'Không thể đổi mật khẩu.'));
        } finally {
            setIsChangingPassword(false);
        }
    };

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    if (isLoading) {
        return (
            <main className="profile-page">
                <div className="profile-loading">Đang tải hồ sơ tài khoản...</div>
            </main>
        );
    }

    return (
        <main className="profile-page">
            <div className="profile-shell">
                <aside className="profile-sidebar">
                    <div className="profile-account-card">
                        <div className="profile-avatar">
                            {profile.avatarUrl ? <img src={profile.avatarUrl} alt={profile.fullName || profile.username} /> : <span>{initials}</span>}
                        </div>
                        <div>
                            <h2>{profile.fullName || profile.username}</h2>
                            <p>@{profile.username}</p>
                            <span className="profile-role-badge">{profile.role || 'USER'}</span>
                        </div>
                    </div>

                    <nav className="profile-menu">
                        {tabs.map(tab => (
                            <button
                                key={tab.key}
                                type="button"
                                className={activeTab === tab.key ? 'active' : ''}
                                onClick={() => setActiveTab(tab.key)}
                            >
                                {tab.icon}
                                <span>{tab.label}</span>
                            </button>
                        ))}
                    </nav>

                    <button type="button" className="profile-logout-btn" onClick={handleLogout}>
                        <FiLogOut />
                        Đăng xuất
                    </button>
                </aside>

                <section className="profile-content">
                    <div className="profile-content-header">
                        <div>
                            <h1>Tài khoản của tôi</h1>
                            <p>Quản lý thông tin hồ sơ, địa chỉ nhận hàng và bảo mật tài khoản.</p>
                        </div>
                    </div>

                    {profileError && <div className="profile-alert error">{profileError}</div>}
                    {profileMessage && <div className="profile-alert success">{profileMessage}</div>}

                    {(activeTab === 'personal' || activeTab === 'contact') && (
                        <form className="profile-panel" onSubmit={handleSaveProfile}>
                            <div className="profile-panel-title">
                                <h2>{activeTab === 'personal' ? 'Thông tin cá nhân' : 'Địa chỉ / liên hệ'}</h2>
                                <button type="submit" disabled={isSavingProfile}>
                                    <FiSave />
                                    {isSavingProfile ? 'Đang lưu...' : 'Lưu thay đổi'}
                                </button>
                            </div>

                            <div className="profile-form-grid">
                                {activeTab === 'personal' && (
                                    <>
                                        <label>
                                            <span>Avatar URL</span>
                                            <input
                                                name="avatarUrl"
                                                value={profile.avatarUrl || ''}
                                                onChange={handleProfileChange}
                                                placeholder="https://..."
                                            />
                                        </label>
                                        <label>
                                            <span>Username</span>
                                            <input value={profile.username || ''} readOnly />
                                        </label>
                                        <label>
                                            <span>Họ tên</span>
                                            <input
                                                name="fullName"
                                                value={profile.fullName || ''}
                                                onChange={handleProfileChange}
                                                placeholder="Nhập họ tên"
                                            />
                                        </label>
                                        <label>
                                            <span>Email</span>
                                            <input
                                                name="email"
                                                type="email"
                                                value={profile.email || ''}
                                                onChange={handleProfileChange}
                                                placeholder="email@example.com"
                                            />
                                        </label>
                                    </>
                                )}

                                {activeTab === 'contact' && (
                                    <>
                                        <label>
                                            <span>Số điện thoại</span>
                                            <input
                                                name="phone"
                                                value={profile.phone || ''}
                                                onChange={handleProfileChange}
                                                placeholder="0xxxxxxxxx"
                                            />
                                        </label>
                                        <label className="wide">
                                            <span>Địa chỉ</span>
                                            <textarea
                                                name="address"
                                                value={profile.address || ''}
                                                onChange={handleProfileChange}
                                                placeholder="Số nhà, đường, phường/xã, quận/huyện, tỉnh/thành"
                                                rows={5}
                                            />
                                        </label>
                                    </>
                                )}
                            </div>
                        </form>
                    )}

                    {activeTab === 'contact' && (
                        <section className="profile-panel address-manager-panel">
                            <div className="profile-panel-title">
                                <div>
                                    <h2>Địa chỉ giao hàng</h2>
                                    <p>Quản lý nhiều địa chỉ nhận hàng và chọn một địa chỉ mặc định cho checkout.</p>
                                </div>
                            </div>

                            {addressError && <div className="profile-alert error">{addressError}</div>}
                            {addressMessage && <div className="profile-alert success">{addressMessage}</div>}

                            <div className="address-list">
                                {isAddressLoading && <div className="address-empty">Đang tải địa chỉ...</div>}
                                {!isAddressLoading && addresses.length === 0 && (
                                    <div className="address-empty">Bạn chưa có địa chỉ giao hàng nào.</div>
                                )}
                                {!isAddressLoading && addresses.map(address => (
                                    <div key={address.id} className="address-card">
                                        <div>
                                            <strong>{address.receiverName}</strong>
                                            <span>{address.receiverPhone}</span>
                                            <p>{address.fullAddress}</p>
                                            {address.isDefault && <em>Mặc định</em>}
                                        </div>
                                        <div className="address-actions">
                                            {!address.isDefault && (
                                                <button type="button" onClick={() => handleSetDefaultAddress(address.id)} disabled={isSavingAddress}>
                                                    Đặt mặc định
                                                </button>
                                            )}
                                            <button type="button" onClick={() => handleEditAddress(address)} disabled={isSavingAddress}>
                                                Sửa
                                            </button>
                                            <button type="button" className="danger" onClick={() => handleDeleteAddress(address.id)} disabled={isSavingAddress}>
                                                Xóa
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <form className="address-form-grid" onSubmit={handleSaveAddress}>
                                <label>
                                    <span>Người nhận</span>
                                    <input name="receiverName" value={addressForm.receiverName} onChange={handleAddressChange} placeholder="Họ tên người nhận" />
                                </label>
                                <label>
                                    <span>Số điện thoại</span>
                                    <input name="receiverPhone" value={addressForm.receiverPhone} onChange={handleAddressChange} placeholder="0xxxxxxxxx" />
                                </label>
                                <label>
                                    <span>Tỉnh / thành phố</span>
                                    <input name="province" value={addressForm.province} onChange={handleAddressChange} placeholder="Ví dụ: Hồ Chí Minh" />
                                </label>
                                <label>
                                    <span>Quận / huyện</span>
                                    <input name="district" value={addressForm.district} onChange={handleAddressChange} placeholder="Ví dụ: Quận 1" />
                                </label>
                                <label>
                                    <span>Phường / xã</span>
                                    <input name="ward" value={addressForm.ward} onChange={handleAddressChange} placeholder="Ví dụ: Bến Nghé" />
                                </label>
                                <label>
                                    <span>Địa chỉ chi tiết</span>
                                    <input name="detailAddress" value={addressForm.detailAddress} onChange={handleAddressChange} placeholder="Số nhà, tên đường" />
                                </label>
                                <label className="address-default-check">
                                    <input type="checkbox" name="isDefault" checked={addressForm.isDefault} onChange={handleAddressChange} />
                                    <span>Đặt làm địa chỉ mặc định</span>
                                </label>
                                <div className="address-form-actions">
                                    {editingAddressId && (
                                        <button type="button" onClick={resetAddressForm} disabled={isSavingAddress}>
                                            Hủy sửa
                                        </button>
                                    )}
                                    <button type="submit" disabled={isSavingAddress}>
                                        {isSavingAddress ? 'Đang lưu...' : editingAddressId ? 'Cập nhật địa chỉ' : 'Thêm địa chỉ'}
                                    </button>
                                </div>
                            </form>
                        </section>
                    )}

                    {activeTab === 'security' && (
                        <form className="profile-panel" onSubmit={handleChangePassword}>
                            <div className="profile-panel-title">
                                <div>
                                    <h2>Bảo mật</h2>
                                    <p>Đổi mật khẩu định kỳ để bảo vệ tài khoản mua hàng.</p>
                                </div>
                                <FiLock className="profile-panel-icon" />
                            </div>

                            {passwordError && <div className="profile-alert error">{passwordError}</div>}
                            {passwordMessage && <div className="profile-alert success">{passwordMessage}</div>}

                            <div className="profile-form-grid">
                                <label>
                                    <span>Mật khẩu hiện tại</span>
                                    <input
                                        name="currentPassword"
                                        type="password"
                                        value={passwordForm.currentPassword}
                                        onChange={handlePasswordChange}
                                        autoComplete="current-password"
                                    />
                                </label>
                                <label>
                                    <span>Mật khẩu mới</span>
                                    <input
                                        name="newPassword"
                                        type="password"
                                        value={passwordForm.newPassword}
                                        onChange={handlePasswordChange}
                                        autoComplete="new-password"
                                    />
                                </label>
                                <label>
                                    <span>Xác nhận mật khẩu mới</span>
                                    <input
                                        name="confirmPassword"
                                        type="password"
                                        value={passwordForm.confirmPassword}
                                        onChange={handlePasswordChange}
                                        autoComplete="new-password"
                                    />
                                </label>
                            </div>

                            <div className="profile-actions">
                                <button type="submit" disabled={isChangingPassword}>
                                    {isChangingPassword ? 'Đang đổi mật khẩu...' : 'Đổi mật khẩu'}
                                </button>
                            </div>
                        </form>
                    )}

                    {activeTab === 'orders' && (
                        <section className="profile-panel orders-panel">
                            <div>
                                <h2>Đơn hàng của tôi</h2>
                                <p>Theo dõi đơn đã đặt, thanh toán lại hoặc hủy đơn đang chờ xử lý.</p>
                            </div>
                            <button type="button" onClick={() => navigate('/orders')}>
                                Xem đơn hàng
                            </button>
                        </section>
                    )}
                </section>
            </div>
        </main>
    );
}

export default Profile;
