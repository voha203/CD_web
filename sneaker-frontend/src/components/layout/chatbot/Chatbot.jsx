import React, { useState, useRef, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import './Chatbot.css';

function Chatbot() {
    // State lưu trạng thái đóng/mở khung chat
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([
        { sender: 'ai', text: 'Xin chào! Mình là MySneaker Bot. Mình có thể giúp gì cho bạn hôm nay? 👟' }
    ]);

    const [inputValue, setInputValue] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    // Tự động cuộc xuống tin nhắn mới nhất
    const messagesEndRef = useRef(null);

    // Tự động sinh ra hoặc lấy lại session_id cũ từ trình duyệt để AI "nhớ" khách hàng này
    const [sessionId] = useState(() => {
        let id = localStorage.getItem("chat_session_id");
        if (!id) {
            id = "session_" + Math.random().toString(36).substr(2, 9);
            localStorage.setItem("chat_session_id", id);
        }
        return id;
    });

    // Tự động cuộn xuống dưới cùng khi có tin nhắn mới
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    // Hàm xử lý khi bấm nút Gửi tin nhắn
    const handleSend = async (e) => {
        e.preventDefault();
        if (!inputValue.trim()) return; // Nếu ô nhập rỗng thì không làm gì cả

        const userMessage = inputValue;
        // Hiển thị tin nhắn của khách lên màn hình chat ngay lập tức
        setMessages(prev => [...prev, { sender: 'user', text: userMessage }]);
        setInputValue('');
        setIsLoading(true); // Bật trạng thái chờ AI trả lời

        try {
            // Gọi API đến server sneaker-ai (đang chạy ở port 5000)
            const response = await fetch('http://localhost:5000/api/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ 
                    session_id: sessionId, 
                    message: userMessage 
                }),
            });

            const data = await response.json();
            if (response.ok) {
                // Thêm câu trả lời của AI vào màn hình chat
                setMessages(prev => [...prev, { sender: 'ai', text: data.reply }]);
            } else {
                setMessages(prev => [...prev, { sender: 'ai', text: 'Hệ thống đang bận, bạn thử lại sau nhé! 😢' }]);
            }
        } catch (error) {
            setMessages(prev => [...prev, { sender: 'ai', text: 'Không thể kết nối tới server AI.' }]);
        } finally {
            setIsLoading(false); // Tắt trạng thái chờ
        }
    };

    return (
        <div className="chatbot-wrapper">
            {/* NÚT TRÒN BONG BÓNG NỔI Ở GÓC MÀN HÌNH */}
            <button className="chat-bubble" onClick={() => setIsOpen(!isOpen)}>
                {isOpen ? '✕' : '💬'}
            </button>

            {/* CỬA SỔ CHATBOX */}
            {isOpen && (
                <div className="chat-window">
                    <div className="chat-header">
                        <div>
                            <h3>MySneaker Assistant 🤖</h3>
                            <span className="status-online">Online</span>
                        </div>
                    </div>

                    {/* VÙNG CHỨA TIN NHẮN */}
                    <div className="chat-messages">
                        {messages.map((msg, index) => (
                            <div key={index} className={`message-row ${msg.sender}`}>
                                <div className="message-text markdown-body">
                                    <ReactMarkdown>{msg.text}</ReactMarkdown>
                                </div>
                            </div>
                        ))}
                        {isLoading && (
                            <div className="message-row ai">
                                <div className="message-text typing-dots">
                                    <span>●</span><span>●</span><span>●</span>
                                </div>
                            </div>
                        )}
                        <div ref={messagesEndRef} />
                    </div>

                    {/* Ô NHẬP TIN NHẮN Ở ĐÁY KHUNG CHAT */}
                    <form className="chat-input-area" onSubmit={handleSend}>
                        <input
                            type="text"
                            placeholder="Nhập câu hỏi của bạn..."
                            value={inputValue}
                            onChange={(e) => setInputValue(e.target.value)}
                            disabled={isLoading}
                        />
                        <button type="submit" disabled={isLoading}>Gửi</button>
                    </form>
                </div>
            )}
        </div>
    );
}

export default Chatbot;