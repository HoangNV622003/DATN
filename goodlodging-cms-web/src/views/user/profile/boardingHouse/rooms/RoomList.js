import React, { useState, useEffect } from 'react';
import './style.scss';
import { createRoom, deleteRoom } from '../../../../../apis/room/RoomService';
import { useNavigate } from 'react-router-dom';
import { ROUTERS } from '../../../../../utils/router/Router';
import { toast } from 'react-toastify';
import { useAuth } from '../../../../../context/AuthContext';

const RoomList = ({ rooms, onRoomChange, boardingHouseId }) => {
  const [isAddingRoom, setIsAddingRoom] = useState(false);
  const navigate = useNavigate();
  const {token}=useAuth();
  const [newRoom, setNewRoom] = useState({
    id: '',
    name: '',
    description: '',
    area: '',
    floor: '',
    price: '',
    capacity: '',
    boardingHouseId: boardingHouseId || null,
  });

  useEffect(() => {
    setNewRoom((prev) => ({ ...prev, boardingHouseId }));
  }, [boardingHouseId]);

  const handleNewRoomChange = (field, value) => {
    setNewRoom({ ...newRoom, [field]: value });
  };

  const handleCreateRoom = async () => {
    if (!boardingHouseId) {
      toast.warn('Vui lòng tạo nhà trọ trước khi thêm phòng!');
      return;
    }
    if (!newRoom.name) {
      toast.warn('Vui lòng nhập tên phòng!');
      return;
    }
    try {
      const response = await createRoom(newRoom,token);
      if (!response.data || !response.data.id) {
        throw new Error('Invalid response from createRoom API');
      }
      const createdRoom = { ...newRoom, id: response.data.id };
      const updatedRooms = [...rooms, createdRoom];
      if (onRoomChange) onRoomChange(updatedRooms); // Truyền danh sách phòng mới lên cha
      setNewRoom({ name: '', description: '', price: '', area: '', capacity: '', floor: '', boardingHouseId });
      setIsAddingRoom(false);
      toast.success('Đã thêm phòng mới!');
    } catch (error) {
      console.error('Error creating room:', error.response?.data || error);
      toast.error(error.response?.data?.message || 'Không thể thêm phòng!');
    }
  };

  const handleCancelAddRoom = () => {
    setNewRoom({ name: '', description: '', price: '', area: '', capacity: '', floor: '', boardingHouseId });
    setIsAddingRoom(false);
  };

  const handleRemoveRoom = async (roomId) => {
    if (!roomId) {
      toast.warn('ID phòng không hợp lệ!');
      return;
    }
    try {
      await deleteRoom(boardingHouseId, roomId,token);
      const updatedRooms = rooms.filter((room) => room.id !== roomId);
      if (onRoomChange) onRoomChange(updatedRooms); // Truyền danh sách phòng mới lên cha
      toast.success('Đã xóa phòng!');
    } catch (error) {
      console.error('Error deleting room:', error.response?.data || error);
      toast.error(error.response?.data?.message || 'Không thể xóa phòng!');
    }
  };
  const handlePaymentHistory = async (roomId) => {
    if (!roomId) {
      toast.warn('Không thể điều hướng: ID phòng không hợp lệ!');
      return;
    }
    navigate(ROUTERS.USER.PROFILE.replace("*", "") + ROUTERS.USER.ROOMS.PAYMENT_HISTORY.replace(":id", roomId));
  }

  const handleNavigateToRoomDetail = async (roomId) => {
    if (!roomId) {
      toast.warn('Không thể điều hướng: ID phòng không hợp lệ!');
      return;
    }
    navigate(ROUTERS.USER.PROFILE.replace("*", "") + ROUTERS.USER.ROOMS.UPDATE.replace(":id", roomId));
  };

  return (
    <div className="room-list">
      <div className="btn-add-room" onClick={() => setIsAddingRoom(true)}>
        Thêm phòng
      </div>

      {isAddingRoom && (
        <div className="room-item new-room">
          <div className="form-row">
            <div className="form-group">
              <label>Tên phòng:</label>
              <input
                type="text"
                value={newRoom.name}
                onChange={(e) => handleNewRoomChange('name', e.target.value)}
                placeholder="Tên phòng"
              />
            </div>
            <div className="form-group">
              <label>Mô tả:</label>
              <input
                type="text"
                value={newRoom.description}
                onChange={(e) => handleNewRoomChange('description', e.target.value)}
                placeholder="Mô tả"
              />
            </div>
          </div>
          <div className="form-row">
            <div className="form-group">
              <label>Diện tích (m²):</label>
              <input
                type="number"
                value={newRoom.area}
                onChange={(e) => handleNewRoomChange('area', e.target.value)}
                placeholder="Diện tích (m²)"
              />
            </div>
            <div className="form-group">
              <label>Tiền thuê:</label>
              <input
                type="number"
                value={newRoom.price}
                onChange={(e) => handleNewRoomChange('price', e.target.value)}
                placeholder="Tiền thuê"
              />
            </div>
          </div>
          <div className="form-row">
            <div className="form-group">
              <label>Số người tối đa:</label>
              <input
                type="number"
                value={newRoom.capacity}
                onChange={(e) => handleNewRoomChange('capacity', e.target.value)}
                placeholder="Số người tối đa"
              />
            </div>
            <div className="form-group">
              <label>Tầng:</label>
              <input
                type="number"
                value={newRoom.floor}
                onChange={(e) => handleNewRoomChange('floor', e.target.value)}
                placeholder="Tầng"
              />
            </div>
          </div>
          <div className="button-group">
            <button type="button" className="room-btn-save" onClick={handleCreateRoom}>Lưu</button>
            <button type="button" className="room-btn-cancel" onClick={handleCancelAddRoom}>Hủy</button>
          </div>
        </div>
      )}

      {rooms.map((room, index) => (
        <div key={room.id || `room-${index}`} className="room-item">
          <div className="form-row">
            <div className="form-group">
              <label>Tên phòng:</label>
              <input type="text" value={room.name} readOnly placeholder="Tên phòng" />
            </div>
            <div className="form-group">
              <label>Mô tả:</label>
              <input type="text" value={room.description} readOnly placeholder="Mô tả" />
            </div>
          </div>
          <div className="form-row">
            <div className="form-group">
              <label>Diện tích (m²):</label>
              <input type="number" value={room.area} readOnly placeholder="Diện tích (m²)" />
            </div>
            <div className="form-group">
              <label>Tiền thuê:</label>
              <input type="number" value={room.price} readOnly placeholder="VND" />
            </div>
          </div>
          <div className="form-row">
            <div className="form-group">
              <label>Số người tối đa:</label>
              <input type="number" value={room.capacity} readOnly placeholder="Người" />
            </div>
            <div className="form-group">
              <label>Tầng:</label>
              <input type="number" value={room.floor} readOnly placeholder="Tầng" />
            </div>
          </div>
          <div className="button-group">
            <button type="button" className="room-btn-remove" onClick={() => handleRemoveRoom(room.id)}>Xóa phòng</button>
            <button type="button" className="room-btn-update" onClick={() => handleNavigateToRoomDetail(room.id)}>Cập nhật</button>
            <button type="button" className='room-btn-payment' onClick={() => handlePaymentHistory(room.id)}>Lịch sử thanh toán</button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default RoomList;