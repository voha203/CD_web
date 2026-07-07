export const API_BASE_URL = (import.meta.env.VITE_API_URL || "/api").replace(/\/+$/, "");

const getApiOrigin = () => {
    try {
        const url = new URL(API_BASE_URL, window.location.origin);
        return url.origin;
    } catch {
        return window.location.origin;
    }
};

export const API_ORIGIN = getApiOrigin();

export const buildApiUrl = (path = "") => {
    const normalizedPath = path.startsWith("/") ? path : `/${path}`;
    return `${API_BASE_URL}${normalizedPath}`;
};

export const resolveAssetUrl = (url, fallback = "https://via.placeholder.com/300") => {
    if (!url) return fallback;
    if (/^https?:\/\//i.test(url)) return url;
    return `${API_ORIGIN}${url.startsWith("/") ? url : `/${url}`}`;
};

export const getGoogleLoginUrl = () => `${API_ORIGIN}/oauth2/authorization/google`;

export const CHATBOT_API_BASE_URL = (import.meta.env.VITE_CHATBOT_API_URL || "").replace(/\/+$/, "");

export const buildChatbotApiUrl = (path = "") => {
    if (!CHATBOT_API_BASE_URL) return "";
    const normalizedPath = path.startsWith("/") ? path : `/${path}`;
    return `${CHATBOT_API_BASE_URL}${normalizedPath}`;
};
