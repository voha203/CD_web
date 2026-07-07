export const API_BASE_URL = (import.meta.env.VITE_API_URL || "/api").replace(/\/+$/, "");

export const PLACEHOLDER_IMAGE_300 =
    "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='300' height='300' viewBox='0 0 300 300'%3E%3Crect width='300' height='300' fill='%23f3f4f6'/%3E%3Cpath d='M92 194h116l-35-46-27 34-19-24-35 36Z' fill='%23d1d5db'/%3E%3Ccircle cx='116' cy='112' r='18' fill='%23d1d5db'/%3E%3Ctext x='150' y='238' text-anchor='middle' font-family='Arial, sans-serif' font-size='16' fill='%236b7280'%3ENo image%3C/text%3E%3C/svg%3E";

export const PLACEHOLDER_IMAGE_600 =
    "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='600' height='600' viewBox='0 0 600 600'%3E%3Crect width='600' height='600' fill='%23f3f4f6'/%3E%3Cpath d='M184 388h232l-70-92-54 68-38-48-70 72Z' fill='%23d1d5db'/%3E%3Ccircle cx='232' cy='224' r='36' fill='%23d1d5db'/%3E%3Ctext x='300' y='476' text-anchor='middle' font-family='Arial, sans-serif' font-size='28' fill='%236b7280'%3ENo image%3C/text%3E%3C/svg%3E";

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

export const resolveAssetUrl = (url, fallback = PLACEHOLDER_IMAGE_300) => {
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
