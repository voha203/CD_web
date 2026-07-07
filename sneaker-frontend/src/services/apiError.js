export const getApiErrorMessage = (err, fallback = "Có lỗi xảy ra. Vui lòng thử lại.") => {
    const data = err?.response?.data || err?.data;

    if (typeof data === "string") return data;

    if (data?.errors && typeof data.errors === "object") {
        const messages = Object.values(data.errors).filter(Boolean);
        if (messages.length > 0) return messages.join("\n");
    }

    if (data?.message) return data.message;
    if (data?.error) return data.error;
    if (err?.message) return err.message;

    return fallback;
};

export const createApiError = async (response, fallback) => {
    let data = null;

    try {
        data = await response.json();
    } catch (error) {
        data = null;
    }

    const error = new Error(fallback || "Có lỗi xảy ra. Vui lòng thử lại.");
    error.response = {
        status: response.status,
        data
    };

    return error;
};
