import React, { useState, useEffect, useRef } from 'react';
import { useChat } from '../../context/ChatContext';
import { useAuth } from '../../context/AuthContext';
import { toast } from 'react-toastify';
import ReactMarkdown from 'react-markdown';
import './ChatBot.scss';
import { sendMessage } from '../../apis/chat/ChatService';

// Component ChatMessage để hiển thị tin nhắn
const ChatMessage = ({ message, isUser }) => {
  return (
    <div className={`chat-message ${isUser ? 'user-message' : 'bot-message'}`}>
      <ReactMarkdown>{message}</ReactMarkdown>
    </div>
  );
};

// Component Chatbot chính
const Chatbot = () => {
  const { isChatOpen, closeChat } = useChat();
  const { user } = useAuth();
  const [messages, setMessages] = useState([
    { text: 'Xin chào! Tôi là chatbot sử dụng Gemini AI. Bạn cần giúp gì?', isUser: false },
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const chatContainerRef = useRef(null);

  // Tự động cuộn xuống cuối khi có tin nhắn mới
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [messages]);

  // Xử lý gửi tin nhắn
  const handleSendMessage = async () => {
    if (input.trim() === '') return;

    // Thêm tin nhắn người dùng
    setMessages((prev) => [...prev, { text: input, isUser: true }]);
    const userMessage = input;
    setInput('');
    setIsLoading(true);

    try {
      // Gọi API
      const payload = {
        userId: user.id,
        message: userMessage,
      };
      const response = await sendMessage(payload);
      setMessages((prev) => [...prev, { text: response.reply, isUser: false }]);
    } catch (error) {
      toast.error('Lỗi khi gửi tin nhắn: ' + error.message);
      setMessages((prev) => [...prev, { text: 'Lỗi: Không thể kết nối với Gemini AI.', isUser: false }]);
    } finally {
      setIsLoading(false);
    }
  };

  // Xử lý nhấn phím Enter
  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSendMessage();
    }
  };

  if (!isChatOpen) return null;

  return (
    <div className="chatbot-container">
      <div className="chat-header">
        <span>Chatbot Gemini AI</span>
        <button className="chat-close-button" onClick={closeChat}>
          ×
        </button>
      </div>
      <div className="chat-container" ref={chatContainerRef}>
        {messages.map((msg, index) => (
          <ChatMessage key={index} message={msg.text} isUser={msg.isUser} />
        ))}
        {isLoading && <div className="loading">Đang xử lý...</div>}
      </div>
      <div className="chat-input-container">
        <input
          type="text"
          className="chat-input"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Nhập tin nhắn..."
        />
        <button
          className="chat-send-button"
          onClick={handleSendMessage}
          disabled={input.trim() === '' || isLoading}
        >
          Gửi
        </button>
      </div>
    </div>
  );
};

export default Chatbot;