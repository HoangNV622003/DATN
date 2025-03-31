// src/user/chatPage/ChatPopup.jsx
import React from 'react';
import './style.scss';

const ChatPopup = ({ onClose }) => {
  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) { // Chỉ đóng khi nhấp vào overlay, không phải nội dung popup
      onClose();
    }
  };

  return (
    <div className="chat-popup-overlay" onClick={handleOverlayClick}>
      <div className="chat-popup">
        <h3>Đoạn Chat</h3>
        <p>Đây là cửa sổ chat của bạn.</p>
      </div>
    </div>
  );
};

export default ChatPopup;