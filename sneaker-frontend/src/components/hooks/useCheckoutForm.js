import { useState, useEffect, useCallback } from 'react';
import { getProfile } from "../../services/authService";
import { getCart } from "../../services/cartService";

export const useCheckoutForm = () => {
    const [formData, setFormData] = useState({
        receiverName: '',
        receiverPhone: '',
        shippingAddress: '',
        paymentMethod: 'COD',
        note: '',
    });
    const [isLoading, setIsLoading] = useState(true);
    const [errors, setErrors] = useState({});
    const [mapPosition, setMapPosition] = useState([10.762622, 106.660172]);    // Tọa độ trung tâm bản đồ lúc đầu (Ví dụ: TP.HCM)
    const [suggestions, setSuggestions] = useState([]);
    const [showSuggestions, setShowSuggestions] = useState(false);

    const [cartData, setCartData] = useState(null);

    useEffect(() => {
        let isMounted = true;
        const init = async () => {
            try {
                const [userRes, cartRes] = await Promise.all([getProfile(), getCart()]);
                if (isMounted) {
                    setCartData(cartRes.data);
                    const { fullName, phone, address } = userRes.data || {};

                    // Cập nhật formData với thông tin từ Database
                    setFormData(prev => ({
                        ...prev,
                        receiverName: fullName || '',
                        receiverPhone: phone || '',
                        shippingAddress: address || ''
                    }));
                }
            } catch (err) {
                console.error(err);
            } finally {
                if (isMounted) setIsLoading(false);
            }
        };
        init();
        return () => {
            isMounted = false;
        };
    }, []);

    // Cập nhật hàm thay đổi input chung
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));

        if (name === 'shippingAddress') {
            setShowSuggestions(true);   // Bật cờ cho phép tìm kiếm khi user đang gõ
        }

        // Xóa thông báo lỗi khi người dùng bắt đầu nhập lại
        if (errors[name]) {
            setErrors(prev => ({
                ...prev,
                [name]: ''
            }));
        }
    };

    // Hàm kiểm tra hợp lệ của địa chỉ trước khi sang bước tiếp theo
    const validateAddressStep = useCallback(() => {
        const newErrors = {};

        const name = formData.receiverName || '';
        const phone = formData.receiverPhone || '';
        const address = formData.shippingAddress || '';

        if (!name.trim()) newErrors.receiverName = "Vui lòng nhập họ và tên người nhận";

        if (!phone.trim()) {
            newErrors.receiverPhone = "Vui lòng nhập số điện thoại";
        } else if (!/^\d{10}$/.test(phone.trim())) {
            newErrors.receiverPhone = "Số điện thoại không hợp lệ (Phải gồm 10 chữ số)";
        }
        if (!address.trim()) newErrors.shippingAddress = "Vui lòng nhập địa chỉ cụ thể để giao hàng";

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    }, [formData]);

    return {
        formData,
        setFormData,
        isLoading,
        errors,
        setErrors,
        mapPosition,
        setMapPosition,
        suggestions,
        setSuggestions,
        showSuggestions,
        setShowSuggestions,
        cartData,
        handleChange,
        validateAddressStep
    };
};