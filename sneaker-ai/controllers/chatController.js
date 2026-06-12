const { getChatSession } = require("../services/chatService");

// Lưu trữ tất cả các phiên chat của từng khách hàng
const activeSessions = {};

const handleChat = async (req, res) => {
    try {
        const { session_id, message } = req.body;
        if (!message) return res.status(400).json({ error: "Thiếu tin nhắn" });
        if (!session_id) return res.status(400).json({ error: "Thiếu session_id" });

        // Nếu khách hàng này chưa từng chat, tạo một phiên chat mới
        if (!activeSessions[session_id]) {
            activeSessions[session_id] = getChatSession();
        }

        // Lấy đúng phiên chat của khách hàng đó ra để xử lý
        const currentChatSession = activeSessions[session_id];

        // Gửi tin nhắn và chờ AI trả lời
        let result = await currentChatSession.sendMessage(message);
        let response = await result.response;

        // Kiểm tra xem người dùng có đang hỏi gì không ?
        const functionCalls = response.functionCalls();

        if (functionCalls && functionCalls.length > 0) {
            const call = functionCalls[0];

            // Nếu AI yêu cầu chạy hàm "tra_cuu_san_pham"
            if (call.name === "tra_cuu_san_pham") {
                const tenGiay = call.args.ten_giay;
                console.log(`🤖 AI đang phát lệnh tìm kiếm sản phẩm: "${tenGiay}"`);

                const backendUrl = `http://localhost:8080/api/products?keyword=${encodeURIComponent(tenGiay)}`;

                let dbData = [];
                try {
                    const apiRes = await fetch(backendUrl);
                    if (apiRes.ok) {
                        dbData = await apiRes.json();
                        console.log("📦 Đã lấy được dữ liệu từ MySQL:", dbData);
                    } else {
                        console.error("❌ Link API sneaker-backend trả về lỗi:", apiRes.statusText);
                    }
                } catch (fetchError) {
                    console.error("❌ Không thể kết nối tới sneaker-backend. Bạn đã bật server đó chưa?", fetchError.message);
                }

                // Trả dữ liệu thô từ Database ngược lại cho AI để nó tự "đọc" và soạn văn bản
                result = await currentChatSession.sendMessage([{
                    functionResponse: {
                        name: "tra_cuu_san_pham",
                        response: {
                            name: "tra_cuu_san_pham",
                            content: dbData // Truyền thẳng mảng sản phẩm từ MySQL vào đây
                        }
                    }
                }]);
                response = result.response;
            }

            // Nếu AI yêu cầu chạy hàm "kiem_tra_don_hang"
            else if (call.name === "kiem_tra_don_hang") {
                // Chỉ lấy phần số, ví dụ khách gõ "DH102" thì lấy "102"
                const maDonHang = call.args.ma_don_hang.replace(/\D/g, '');
                console.log(`🤖 AI đang kiểm tra đơn hàng số: "${maDonHang}"`);

                const backendUrl = `http://localhost:8080/api/orders/${maDonHang}`;

                let dbData = {};
                try {
                    const apiRes = await fetch(backendUrl);
                    if (apiRes.ok) {
                        dbData = await apiRes.json();
                        console.log("📦 Lấy được thông tin đơn hàng:", dbData);
                    } else {
                        dbData = { error: "Không tìm thấy đơn hàng này trên hệ thống." };
                    }
                } catch (fetchError) {
                    dbData = { error: "Lỗi kết nối hệ thống." };
                }

                // Trả data đơn hàng về cho AI đọc
                result = await currentChatSession.sendMessage([{
                    functionResponse: {
                        name: "kiem_tra_don_hang",
                        response: { content: dbData }
                    }
                }]);
                response = result.response;
            }
        }

        const aiReply = response.text();
        res.json({ reply: aiReply });
    } catch (error) {
        console.error("Lỗi AI:", error);
        res.status(500).json({ error: "Hệ thống tư vấn đang bận, vui lòng thử lại sau!" });
    }
};

module.exports = { handleChat };