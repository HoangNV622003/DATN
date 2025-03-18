// src/components/rooms/RoomList.jsx
import React from 'react';
import './style.scss';

const RoomList = ({ rooms, onRoomChange, onRemoveRoom }) => {
  // Thêm phòng mới
  const handleCreateRoom = () => {
    const newRoom = { name: '', description: '', area: '', floor: '' };
    const updatedRooms = [...rooms, newRoom];
    if (onRoomChange) onRoomChange(updatedRooms); // Gửi danh sách mới lên parent
  };

  // Cập nhật phòng
  const handleUpdateRoom = (index, field, value) => {
    const updatedRooms = [...rooms];
    updatedRooms[index] = { ...updatedRooms[index], [field]: value };
    if (onRoomChange) onRoomChange(updatedRooms); // Gửi danh sách mới lên parent
  };

  // Xóa phòng
  const handleRemoveRoom = (index) => {
    const updatedRooms = rooms.filter((_, i) => i !== index);
    if (onRemoveRoom) onRemoveRoom(index); // Gọi callback parent
    if (onRoomChange) onRoomChange(updatedRooms); // Gửi danh sách mới lên parent
  };

  return (
    <div className="room-list">
      <div className="btn-add-room" onClick={handleCreateRoom}>
        Thêm phòng
      </div>
      {rooms.map((room, index) => (
        <div key={index} className="room-item">
          <div className="form-group">
            <label htmlFor={`name-${index}`}>Tên phòng:</label>
            <input
              type="text"
              id={`name-${index}`}
              name="name"
              value={room.name}
              onChange={(e) => handleUpdateRoom(index, 'name', e.target.value)}
              placeholder="Tên phòng"
            />
          </div>
          <div className="form-group">
            <label htmlFor={`description-${index}`}>Mô tả:</label>
            <input
              type="text"
              id={`description-${index}`}
              name="description"
              value={room.description}
              onChange={(e) => handleUpdateRoom(index, 'description', e.target.value)}
              placeholder="Mô tả"
            />
          </div>
          <div className="form-group">
            <label htmlFor={`area-${index}`}>Diện tích (m²):</label>
            <input
              type="number"
              id={`area-${index}`}
              name="area"
              value={room.area}
              onChange={(e) => handleUpdateRoom(index, 'area', e.target.value)}
              placeholder="Diện tích (m²)"
            />
          </div>
          <div className="form-group">
            <label htmlFor={`floor-${index}`}>Tầng:</label>
            <input
              type="number"
              id={`floor-${index}`}
              name="floor"
              value={room.floor}
              onChange={(e) => handleUpdateRoom(index, 'floor', e.target.value)}
              placeholder="Tầng"
            />
          </div>
          <div className="button-group">
            <button
              type="button"
              className="btn-remove"
              onClick={() => handleRemoveRoom(index)}
            >
              Xóa phòng
            </button>
            <button
              type="button"
              className="btn-update"
              onClick={() => handleUpdateRoom(index, null, null)} // Chỉ để giữ nút cho giao diện
            >
              Cập nhật
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default RoomList;