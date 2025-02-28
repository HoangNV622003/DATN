import React from 'react';
import { useNavigate } from 'react-router-dom';

const HomePage = () => {
    const navigate=useNavigate();
    const handleNavigateToLogin=()=>{
        navigate('/login')
    }
    return (
        <div>
            <p>Home page</p>
            <button onClick={handleNavigateToLogin}>Đăng xuất</button>
        </div>
    );
};

export default HomePage;