import React from 'react';
import { useNavigate } from 'react-router-dom';
import { memo } from 'react';
import LoadingItem from '../../../components/common/loading/LoadingItem';
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

export default memo(HomePage);