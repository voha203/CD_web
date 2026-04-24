// Nhận diện người dùng đang nhập số điện thoại hay mail
export const detectIdentifier = (value) => {
    const isEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
    const isPhone = /^[0-9]{9,11}$/.test(value);

    if (isEmail) return "email";
    if (isPhone) return "phone";
    return "invalid";
};