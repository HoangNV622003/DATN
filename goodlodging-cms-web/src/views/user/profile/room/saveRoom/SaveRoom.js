import React from 'react';
import "./style.scss";
const SaveRoom = ({rooms}) => {
    const handleRemoveRoom=()=>{

    }
    return (
        <div>
            {rooms.map((room, index) => (
          <div key={index}>
            <input
              type="text"
              name="name"
              value={room.name}
              placeholder="Tên phòng"
            />
            <input
              type="text"
              name="description"
              value={room.description}
              placeholder="Mô tả"
            />
            <input
              type="number"
              name="area"
              value={room.area}
              placeholder="Diện tích (m²)"
            />
            <input
              type="number"
              name="floor"
              value={room.floor}
              placeholder="Tầng"
            />
            <button type="button" onClick={handleRemoveRoom}>Xóa phòng</button>
          </div>
        ))}
        </div>
    );
};

export default SaveRoom;