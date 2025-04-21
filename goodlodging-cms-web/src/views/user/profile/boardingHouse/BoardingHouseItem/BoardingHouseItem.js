import React, { memo, useState } from 'react';
import defaultRoom from "../../../../../assets/images/defaultRoom.png";
import { useNavigate } from 'react-router-dom';
import { ROUTERS } from '../../../../../utils/router/Router';
import "./style.scss";
import { IMAGE_URL } from '../../../../../utils/ApiUrl';
import { getArea, getPrice } from '../../../../../utils/BoardingHouseConfig';
import { toast } from 'react-toastify';
import { changeOwner, deleteBoardingHouse } from '../../../../../apis/house/BoardingHouseService';
import { useAuth } from '../../../../../context/AuthContext';
import TransferPopup from '../../../../../components/popup/TransferPopup/TransferPopup';

const BoardingHouseItem = ({ data, onSelect, isSelected, isSavePost, onDelete, onTransferSuccess }) => {
    const { id, name, address, minArea, maxArea, otherPrice, minRent, maxRent, electricityPrice, waterPrice, imageUrl } = data;
    const navigate = useNavigate();
    const { token } = useAuth();
    const [username, setUsername] = useState(data.username);
    const [isPopupOpen, setIsPopupOpen] = useState(false);
    const [isTransferring, setIsTransferring] = useState(false); // Thêm state loading

    const handleNavigateToSaveBoardingHouse = () => {
        navigate(ROUTERS.USER.PROFILE.replace("*", "") + ROUTERS.USER.BOARDING_HOUSE.UPDATE.replace(":boardingHouseId", id));
    };

    const handleDeleteBoardingHouse = (e) => {
        e.stopPropagation();
        deleteBoardingHouse(id, token)
            .then(response => {
                toast.success(response.data.result || "Xóa nhà trọ thành công");
                if (onDelete) {
                    onDelete(id);
                }
            })
            .catch(error => {
                toast.error(error.message || "Xóa nhà trọ thất bại");
            });
    };

    const handleRadioChange = () => {
        if (onSelect) {
            onSelect(data);
        }
    };

    const handleChangeOwner = () => {
        setIsTransferring(true); // Bật loading
        changeOwner(id, username, token)
            .then(response => {
                toast.success(response.data.result || "Chuyển nhượng nhà trọ thành công");
                setIsPopupOpen(false);
                if (onTransferSuccess) {
                    onTransferSuccess(id);
                }
            })
            .catch(error => {
                toast.error(error.message || "Chuyển nhượng nhà trọ thất bại");
            })
            .finally(() => setIsTransferring(false)); // Tắt loading
    };

    const handleOpenPopup = (e) => {
        e.stopPropagation();
        setIsPopupOpen(true);
    };

    const handleClosePopup = () => {
        setIsPopupOpen(false);
    };

    return (
        <div className='boarding__house__item' onClick={handleNavigateToSaveBoardingHouse}>
            <div className="container__image">
                <img
                    src={Array.isArray(imageUrl) && imageUrl.length > 0 ? IMAGE_URL + imageUrl[0] : defaultRoom}
                    alt={name || "Boarding House"}
                />
            </div>
            <div className="container__house__information">
                <p>{name}</p>
                <p>Tiền phòng: {getPrice(minRent, maxRent)}đ</p>
                <p>Diện tích phòng: {getArea(minArea, maxArea)}m²</p>
                <p>Tiền điện: {electricityPrice}đ</p>
                <p>Tiền nước: {waterPrice}đ</p>
                <p>Chi phí khác: {otherPrice}đ</p>
                <p>Địa chỉ: {address}</p>
            </div>
            {isSavePost ? (
                <input
                    type="radio"
                    name="boardingHouse"
                    checked={isSelected}
                    onChange={handleRadioChange}
                    onClick={(e) => e.stopPropagation()}
                />
            ) : (
                <div className="container-button">
                    <button className='btn-delete' onClick={handleDeleteBoardingHouse}>
                        Xóa
                    </button>
                    <button className='btn-change-owner' onClick={handleOpenPopup}>
                        Chuyển nhượng
                    </button>
                </div>
            )}
            <TransferPopup
                isOpen={isPopupOpen}
                onClose={handleClosePopup}
                onTransfer={handleChangeOwner}
                initialUsername={username}
                setUsername={setUsername}
                isLoading={isTransferring} // Truyền prop để disable nút trong popup nếu cần
            />
        </div>
    );
};

export default memo(BoardingHouseItem);