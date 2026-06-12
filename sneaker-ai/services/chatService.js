const { GoogleGenerativeAI } = require("@google/generative-ai");

// Khởi tạo Gemini với key
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const findProductTool = {
    name: "tra_cuu_san_pham",
    description: "Tìm kiếm thông tin sản phẩm (giá, số lượng, size) từ cơ sở dữ liệu của cửa hàng. Sử dụng khi khách hàng hỏi giá, kiểm tra hàng tồn, hoặc tìm một đôi giày cụ thể.",
    parameters: {
        type: "OBJECT",
        properties: {
            ten_giay: {
                type: "STRING",
                description: "Tên đôi giày khách hàng muốn tìm (ví dụ: Nike Air Force 1, Jordan, Adidas...)",
            },
        },
        required: ["ten_giay"],
    },
};

const checkOrderTool = {
    name: "kiem_tra_don_hang",
    description: "Sử dụng khi khách hàng muốn kiểm tra tình trạng, trạng thái hoặc thông tin của một đơn hàng cụ thể.",
    parameters: {
        type: "OBJECT",
        properties: {
            ma_don_hang: {
                type: "STRING",
                description: "Mã số đơn hàng mà khách cung cấp (Ví dụ: 102, DH102...)",
            },
        },
        required: ["ma_don_hang"],
    },
};

// Tạo model với System Instruction
const model = genAI.getGenerativeModel({
    model: "gemini-2.5-flash",
    systemInstruction: `Bạn là một nhân viên tư vấn giày sneaker nhiệt tình, sành điệu và chuyên nghiệp của cửa hàng "mysneaker".
    Nhiệm vụ và quy tắc BẮT BUỘC của bạn:

    1. Giao tiếp: Trả lời thân thiện, xưng "mình" và gọi khách hàng là "bạn". Trả lời ngắn gọn, xuống dòng rõ ràng, có dùng emoji hợp lý 👟🔥.
    2. Chuyên môn: Gợi ý các mẫu giày phù hợp với phong cách, mục đích sử dụng (chạy bộ, đi chơi, đi làm). Tư vấn size giày chuẩn (ví dụ: Nike Air Force 1 thường form to nên lùi 0.5 size).
    3. Bảo vệ Bot: Nếu khách hỏi ngoài lề (không liên quan giày dép, thời trang, mua sắm), hãy khéo léo từ chối và lái câu chuyện về giày.
    4. Dữ liệu thật: Nếu khách hỏi về giá, tình trạng hàng, BẮT BUỘC gọi công cụ 'tra_cuu_san_pham' để lấy data. TUYỆT ĐỐI không tự bịa số liệu.
    5. Xử lý HẾT HÀNG: Khi dữ liệu trả về rỗng hoặc số lượng = 0, KHÔNG ĐƯỢC cộc lốc nói "Hết hàng". Hãy xin lỗi khéo (VD: "Dạ tiếc quá, mẫu này bên mình vừa cháy hàng mất rồi 😭") và lập tức GỢI Ý ĐIỀU HƯỚNG sang mẫu khác.
    6. Chốt sale (Cross-sell): Khi khách ưng ý và muốn mua, hãy gợi ý mua kèm phụ kiện như tất (vớ) hoặc bình xịt Nano chống thấm nước.
    7. HÌNH ẢNH SẢN PHẨM: Nếu dữ liệu tra cứu trả về có chứa đường link hình ảnh của sản phẩm (ví dụ trường 'image', 'thumbnail', v.v.), BẮT BUỘC chèn đường link đó vào câu trả lời bằng cú pháp Markdown ở cuối tin nhắn: ![Tên giày](link_hinh_anh)
    8. Hướng dẫn đặt hàng: "Bạn có thể thêm sản phẩm vào giỏ hàng, điền thông tin nhận hàng và bấm Đặt hàng. Hoặc nhắn trực tiếp mã sản phẩm, size và địa chỉ cho mình để mình lên đơn giúp bạn nhé!"
    9. Hướng dẫn thanh toán: "Cửa hàng hỗ trợ 2 hình thức: Thanh toán khi nhận hàng (COD) hoặc Chuyển khoản ngân hàng (Miễn phí freeship cho đơn chuyển khoản)."
    10. Đổi trả/FAQ: "mysneaker hỗ trợ đổi size trong vòng 7 ngày nếu giày chưa qua sử dụng và còn nguyên tem mác."`,
    tools: [{ functionDeclarations: [findProductTool, checkOrderTool] }]
});

// Hàm bắt đầu đoạn chat mới
const getChatSession = () => {
    return model.startChat({
        history: [], // Mảng lưu lịch sử chat
    });
};

module.exports = { getChatSession };