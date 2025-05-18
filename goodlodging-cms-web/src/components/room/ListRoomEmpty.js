import React from 'react';
import "./style.scss"
const ListRoomEmpty = ({rooms}) => {
    return (
        <div className='list-room-empty'>
            <p className="room__found">Có {rooms.length} phòng trống:</p>
            {
                rooms.map((item,key)=>(
                    <div className="room-item">
                        <p>Phòng: {item.name}</p>
                        <p>Sức chứa: {item.capacity} Người</p>
                        <p>Diện tích: {item.area}m&sup2;</p>
                        <p>Giá phòng: {item.price}đ</p>
                    </div>
                ))
            }
        </div>
    );
};

export default ListRoomEmpty;