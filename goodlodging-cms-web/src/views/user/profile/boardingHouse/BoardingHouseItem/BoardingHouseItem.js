import React, { memo } from 'react';
import defaultRoom from "../../../../../assets/images/defaultRoom.png";
import { useNavigate } from 'react-router-dom';
import { ROUTERS } from '../../../../../utils/router/Router';
import "./style.scss";
import { IMAGE_URL } from '../../../../../utils/ApiUrl';
import { getArea, getPrice } from '../../../../../utils/BoardingHouseConfig';
import { toast } from 'react-toastify';
import { deleteBoardingHouse } from '../../../../../apis/house/BoardingHouseService';
import { useAuth } from '../../../../../context/AuthContext';

const BoardingHouseItem = ({ data, onSelect, isSelected, isSavePost, onDelete }) => {
    const { id, name, address, minArea, maxArea, otherPrice, minRent, maxRent, electricityPrice, waterPrice, imageUrl } = data;
    const navigate = useNavigate();
    const { token } = useAuth();

    const handleNavigateToSaveBoardingHouse = () => {
        navigate(ROUTERS.USER.PROFILE.replace("*", "") + ROUTERS.USER.BOARDING_HOUSE.UPDATE.replace(":boardingHouseId", id));
    };

    const handleDeleteBoardingHouse = (e) => {
        e.stopPropagation();
        deleteBoardingHouse(id, token)
            .then(response => {
                toast.success(response.data.result || "Xóa nhà trọ thành công");
                if (onDelete) {
                    onDelete(id); // Gọi callback để cập nhật danh sách
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
                <p>Địa chỉ: {address}</p>
                <p>Tiền phòng: {getPrice(minRent, maxRent)}đ</p>
                <p>Diện tích phòng: {getArea(minArea, maxArea)}m²</p>
                <p>Tiền điện: {electricityPrice}đ</p>
                <p>Tiền nước: {waterPrice}đ</p>
                <p>Chi phí khác: {otherPrice}đ</p>
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
                <button className='btn-delete' onClick={handleDeleteBoardingHouse}>
                    Xóa
                </button>
            )}
        </div>
    );
};

export default memo(BoardingHouseItem);