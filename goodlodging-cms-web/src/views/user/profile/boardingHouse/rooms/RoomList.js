import React, { useState, useEffect } from 'react';
import './style.scss';
import { createRoom, deleteRoom } from '../../../../../apis/room/RoomService';

const RoomList = ({ rooms, onRoomChange, boardingHouseId }) => {
  const [isAddingRoom, setIsAddingRoom] = useState(false);
  const [newRoom, setNewRoom] = useState({
    id: '',
    name: '',
    description: '',
    area: '',
    floor: '',
    boardingHouseId: boardingHouseId || null,
  });

  useEffect(() => {
    setNewRoom((prev) => ({ ...prev, boardingHouseId }));
  }, [boardingHouseId]);

  const handleNewRoomChange = (field, value) => {
    setNewRoom({ ...newRoom, [field]: value });
  };

  const handleCreateRoom = async () => {
    if (!newRoom.name) {
      alert('Vui lòng nhập tên phòng!');
      return;
    }
    try {
      const response = (await createRoom(newRoom)).data;
      const createdRoom = { ...newRoom, id: response.id };
      const updatedRooms = [...rooms, createdRoom];
      if (onRoomChange) onRoomChange(updatedRooms);
      setNewRoom({ name: '', description: '', area: '', floor: '', boardingHouseId });
      setIsAddingRoom(false);
    } catch (error) {
      console.error('Error creating room:', error.response?.data || error);
      alert(error.response?.data?.message || 'Không thể thêm phòng!');
    }
  };

  const handleCancelAddRoom = () => {
    setNewRoom({ name: '', description: '', area: '', floor: '', boardingHouseId });
    setIsAddingRoom(false);
  };

  const handleRemoveRoom = async (roomId) => {
    try {
      if (roomId) {
        await deleteRoom(roomId);
        const updatedRooms = rooms.filter((room) => room.id !== roomId);
        if (onRoomChange) onRoomChange(updatedRooms);
      }
    } catch (error) {
      console.error('Error deleting room:', error.response?.data || error);
      alert(error.response?.data?.message || 'Không thể xóa phòng!');
    }
  };

  return (
    <div className="room-list">
      <div className="btn-add-room" onClick={() => setIsAddingRoom(true)}>
        Thêm phòng
      </div>

      {isAddingRoom && (
        <div className="room-item new-room">
          <div className="form-group">
            <label>Tên phòng:</label>
            <input type="text" value={newRoom.name} onChange={(e) => handleNewRoomChange('name', e.target.value)} placeholder="Tên phòng" />
          </div>
          <div className="form-group">
            <label>Mô tả:</label>
            <input type="text" value={newRoom.description} onChange={(e) => handleNewRoomChange('description', e.target.value)} placeholder="Mô tả" />
          </div>
          <div className="form-group">
            <label>Diện tích (m²):</label>
            <input type="number" value={newRoom.area} onChange={(e) => handleNewRoomChange('area', e.target.value)} placeholder="Diện tích (m²)" />
          </div>
          <div className="form-group">
            <label>Tầng:</label>
            <input type="number" value={newRoom.floor} onChange={(e) => handleNewRoomChange('floor', e.target.value)} placeholder="Tầng" />
          </div>
          <div className="button-group">
            <button type="button" className="btn-save" onClick={handleCreateRoom}>Lưu</button>
            <button type="button" className="btn-cancel" onClick={handleCancelAddRoom}>Hủy</button>
          </div>
        </div>
      )}

      {rooms.map((room, index) => (
        <div key={room.id || `room-${index}`} className="room-item">
          <div className="form-group">
            <label>Tên phòng:</label>
            <input type="text" value={room.name} readOnly placeholder="Tên phòng" />
          </div>
          <div className="form-group">
            <label>Mô tả:</label>
            <input type="text" value={room.description} readOnly placeholder="Mô tả" />
          </div>
          <div className="form-group">
            <label>Diện tích (m²):</label>
            <input type="number" value={room.area} readOnly placeholder="Diện tích (m²)" />
          </div>
          <div className="form-group">
            <label>Tầng:</label>
            <input type="number" value={room.floor} readOnly placeholder="Tầng" />
          </div>
          <div className="button-group">
            <button type="button" className="btn-remove" onClick={() => handleRemoveRoom(room.id)}>Xóa phòng</button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default RoomList;