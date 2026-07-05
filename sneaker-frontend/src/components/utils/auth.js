export const getToken = () => {
    return localStorage.getItem("token");
};

export const getCurrentUser = () => {
    const rawUser = localStorage.getItem("user");

    if (!rawUser) return null;

    try {
        return JSON.parse(rawUser);
    } catch {
        return null;
    }
};

export const saveAuth = ({ token, user }) => {
    localStorage.setItem("token", token);
    localStorage.setItem("user", JSON.stringify(user));
    window.dispatchEvent(new Event("auth-changed"));
};

export const isAuthenticated = () => {
    return !!getToken();
};

export const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    window.dispatchEvent(new Event("auth-changed"));
};
