require('dotenv').config();

// Sử dụng hàm fetch mặc định của Node.js để gọi thẳng lên Google
fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${process.env.GEMINI_API_KEY}`)
    .then(res => res.json())
    .then(data => {
        if (data.error) {
            console.error("Lỗi API Key:", data.error.message);
            return;
        }

        // Lọc và in ra danh sách các model có hỗ trợ tạo nội dung (generateContent)
        const chatModels = data.models
            .filter(m => m.supportedGenerationMethods.includes("generateContent"))
            .map(m => m.name.replace("models/", ""));

        console.log("✅ Dưới đây là các model mà API Key của bạn ĐƯỢC PHÉP dùng:");
        console.log(chatModels);
    })
    .catch(err => console.error("Lỗi kết nối:", err));