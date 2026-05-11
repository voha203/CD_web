export const getToken = () => {
    // return localStorage.getItem("token");
    // Sử dụng token được tạo sẵn
    return "eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJhZG1pbiIsImlhdCI6MTc3ODUwOTUyNCwiZXhwIjoxNzc4NTk1OTI0fQ.c3vs0tcv01AVftXy8UE5970VDWN5xbd5VtUVprUrRyg";
};

export const isAuthenticated = () => {
    return !!getToken();
};

export const logout = () => {
    localStorage.removeItem("token");
};