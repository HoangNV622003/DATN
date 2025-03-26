import React, { memo } from 'react';
import defaultRoom from "../../../../../assets/images/defaultRoom.png";
import { useNavigate } from 'react-router-dom';
import { ROUTERS } from '../../../../../utils/router/Router';
import "./style.scss";
import { IMAGE_URL } from '../../../../../utils/ApiUrl';

const BoardingHouseItem = ({ data, onSelect, isSelected, isSavePost }) => {
    const { id, name, address, description,roomArea, roomRent, electricityPrice, waterPrice, feature, imageUrl } = data;
    const navigate = useNavigate();

    const handleNavigateToSaveBoardingHouse = () => {
        // if (!isSavePost) {
            
        // }
        navigate(ROUTERS.USER.PROFILE.replace("*","")+ROUTERS.USER.BOARDING_HOUSE.UPDATE.replace(":boardingHouseId",id))
    };

    const handleDeleteBoardingHouse = (e) => {
        e.stopPropagation(); // Ngăn click lan lên thẻ cha
        // Logic xóa nếu cần
    };

    const handleRadioChange = () => {
        if (onSelect) {
            onSelect(data); // Gửi dữ liệu của BoardingHouse được chọn
        }
    };

    return (
        <div className='boarding__house__item' onClick={handleNavigateToSaveBoardingHouse}>
            <div className="container__image">
                <img
                    src={Array.isArray(imageUrl) && imageUrl.length > 0 ? IMAGE_URL+ imageUrl[0] : defaultRoom}
                    alt={name || "Boarding House"}
                />
            </div>
            <div className="container__house__information">
                <p>{name}</p>
                <p>Địa chỉ: {address}</p>
                <p>Tiền phòng: {roomRent}</p>
                <p>Diện tích phòng: {roomArea}</p>
                <p>Tiền điện: {electricityPrice}</p>
                <p>Tiền nước: {waterPrice}</p>
            </div>
            {isSavePost ? (
                <input
                    type="radio"
                    name="boardingHouse"
                    checked={isSelected}
                    onChange={handleRadioChange}
                    onClick={(e) => e.stopPropagation()} // Ngăn click lan lên thẻ cha
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