import React, { useState, useEffect, memo } from 'react';
import ListBoardingHouse from '../../listBoardingHouse/ListBoardingHouse';
import { useAuth } from '../../../../../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { ROUTERS } from '../../../../../../utils/router/Router';
import { fetchAllHouse } from '../../../../../../apis/house/BoardingHouseService';
import './style.scss';
import { toast } from 'react-toastify';

const ForRentBoardingHouse = () => {
    const { user, isLogin, loading, token } = useAuth();
    const [boardingHouses, setBoardingHouses] = useState([]);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        // Chỉ chạy logic sau khi loading hoàn tất
        if (!loading) {
            if (!isLogin || !user) {
                toast.error("Vui lòng đăng nhập để tiếp tục");
                navigate(ROUTERS.AUTH.LOGIN);
            } else {
                loadBoardingHouses();
            }
        }
    }, [isLogin, user, loading, navigate,token]);

    const loadBoardingHouses = async () => {
        try {
            const result = await fetchAllHouse(user.id, token);
            setBoardingHouses(result || []);
            console.log(result);
            setError(null);
        } catch (err) {
            setError("Có lỗi khi lấy dữ liệu, vui lòng thử lại");
            setBoardingHouses([]);
        }
    };

    const handleDeleteBoardingHouse = (deletedId) => {
        setBoardingHouses(prev => prev.filter(house => house.id !== deletedId));
    };

    const handleTransferSuccess = (transferredId) => {
        setBoardingHouses(prev => prev.filter(house => house.id !== transferredId));
    };

    // Hiển thị loading khi đang xác thực
    if (loading) {
        return <div className="loading">Đang tải thông tin...</div>;
    }

    // Chỉ render nội dung khi đã xác thực và có user
    if (!isLogin || !user) {
        return null;
    }

    return (
        <div className='container__for__rent'>
            {error && <div className="error">{error}</div>}
            <ListBoardingHouse
                boardingHouses={boardingHouses}
                onDelete={handleDeleteBoardingHouse}
                onTransferSuccess={handleTransferSuccess}
            />
        </div>
    );
};

export default memo(ForRentBoardingHouse);