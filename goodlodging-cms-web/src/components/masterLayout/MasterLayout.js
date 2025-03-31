import React from 'react';
import { memo } from 'react';
import Header from '../header/Header';
import Footer from '../footer/Footer';
import { Outlet } from 'react-router-dom';
import { useChat } from '../../context/ChatContext';
import ChatPopup from '../chat/ChatPopUp';
const MasterLayout = ({children, ...props}) => {
    const { isChatOpen, closeChat } = useChat();
    return (
        <div {...props} className='master_layout'> 
            <Header/>
            <Outlet/>
            {isChatOpen && <ChatPopup onClose={closeChat} />}
            <Footer/>
        </div>
    );
};

export default memo(MasterLayout);