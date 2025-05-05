import React from 'react';
import { useChat } from '../../context/ChatContext';
import { FaCommentDots } from 'react-icons/fa';
import './ChatIcon.scss'; // Import CSS styles for the chat icon

const ChatIcon = () => {
    const { isChatOpen, openChat, closeChat } = useChat();

    const toggleChat = () => {
        if (isChatOpen) {
            closeChat();
        } else {
            openChat();
        }
    };

    return (
        <div className="chat-icon-container" onClick={toggleChat}>
            <FaCommentDots className="chat-icon" />
        </div>
    );
};

export default ChatIcon;