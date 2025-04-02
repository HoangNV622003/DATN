import React, { useState, useEffect, memo } from 'react';
import ListBoardingHouse from '../../listBoardingHouse/ListBoardingHouse';
import { useAuth } from '../../../../../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { ROUTERS } from '../../../../../../utils/router/Router';
import { fetchAllHouse } from '../../../../../../apis/house/BoardingHouseService';
import './style.scss';

const ForRentBoardingHouse = () => {
    const { user, isLogin, loading, token } = useAuth();
    const [boardingHouses, setBoardingHouses] = useState([]);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        if (!loading && (!isLogin || !user)) {
            alert("Vui lòng đăng nhập");
            navigate(`/${ROUTERS.AUTH.LOGIN}`);
        } else if (user) {
            loadBoardingHouses();
        }
    }, [isLogin, user, loading, navigate]);

    const loadBoardingHouses = async () => {
        try {
            const result = await fetchAllHouse(user.id, token);
            setBoardingHouses(result || []);
            setError(null);
        } catch (err) {
            setError("Có lỗi khi lấy dữ liệu, vui lòng thử lại");
            setBoardingHouses([]);
        }
    };

    const handleDeleteBoardingHouse = (deletedId) => {
        setBoardingHouses(prev => prev.filter(house => house.id !== deletedId));
    };

    if (loading) {
        return <div className="loading">Đang tải thông tin...</div>;
    }

    if (!isLogin || !user) {
        return null;
    }

    return (
        <div className='container__for__rent'>
            {error && <div className="error">{error}</div>}
            <ListBoardingHouse
                boardingHouses={boardingHouses}
                onDelete={handleDeleteBoardingHouse} // Truyền callback xuống
            />
        </div>
    );
};

export default memo(ForRentBoardingHouse);