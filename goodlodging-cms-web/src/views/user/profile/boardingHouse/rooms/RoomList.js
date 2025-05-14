import React, { useState, useEffect } from 'react';
import './style.scss';
import { createRoom, deleteRoom } from '../../../../../apis/room/RoomService';
import { useNavigate } from 'react-router-dom';
import { ROUTERS } from '../../../../../utils/router/Router';
import { toast } from 'react-toastify';
import { useAuth } from '../../../../../context/AuthContext';

const NewRoomForm = ({ boardingHouseId, onSave, onCancel }) => {
  const [newRoom, setNewRoom] = useState({
    name: '',
    area: '',
    price: '',
    capacity: '',
    floor: '',
    boardingHouseId,
  });
  const { token } = useAuth();

  const handleChange = (field, value) => {
    setNewRoom((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async () => {
    if (!boardingHouseId) {
      toast.warn('Vui lòng tạo nhà trọ trước khi thêm phòng!');
      return;
    }
    if (!newRoom.name.trim()) {
      toast.warn('Vui lòng nhập tên phòng!');
      return;
    }
    try {
      const response = await createRoom(newRoom, token);
      if (!response.data?.id) {
        throw new Error('Phản hồi không hợp lệ từ API tạo phòng');
      }
      onSave({ ...newRoom, id: response.data.id });
      setNewRoom({
        name: '',
        area: '',
        price: '',
        capacity: '',
        floor: '',
        boardingHouseId,
      });
      toast.success('Thêm phòng thành công!');
    } catch (error) {
      console.error('Lỗi khi tạo phòng:', error.response?.data || error);
      toast.error(error.response?.data?.message || 'Không thể thêm phòng!');
    }
  };

  return (
    <div className="room-item new-room" data-testid="new-room-form">
      <div className="form-grid">
        <div className="form-group">
          <label htmlFor="room-name">Tên phòng:</label>
          <input
            id="room-name"
            type="text"
            value={newRoom.name}
            onChange={(e) => handleChange('name', e.target.value)}
            placeholder="Nhập tên phòng"
            aria-label="Tên phòng"
          />
        </div>
        <div className="form-group">
          <label htmlFor="room-area">Diện tích (m²):</label>
          <input
            id="room-area"
            type="number"
            value={newRoom.area}
            onChange={(e) => handleChange('area', e.target.value)}
            placeholder="Nhập diện tích"
            aria-label="Diện tích phòng"
          />
        </div>
        <div className="form-group">
          <label htmlFor="room-price">Tiền thuê (VND):</label>
          <input
            id="room-price"
            type="number"
            value={newRoom.price}
            onChange={(e) => handleChange('price', e.target.value)}
            placeholder="Nhập tiền thuê"
            aria-label="Tiền thuê phòng"
          />
        </div>
        <div className="form-group">
          <label htmlFor="room-capacity">Số người tối đa:</label>
          <input
            id="room-capacity"
            type="number"
            value={newRoom.capacity}
            onChange={(e) => handleChange('capacity', e.target.value)}
            placeholder="Nhập số người"
            aria-label="Số người tối đa"
          />
        </div>
        <div className="form-group">
          <label htmlFor="room-floor">Tầng:</label>
          <input
            id="room-floor"
            type="number"
            value={newRoom.floor}
            onChange={(e) => handleChange('floor', e.target.value)}
            placeholder="Nhập vị trí tầng"
            aria-label="Tầng"
          />
        </div>
      </div>
      <div className="button-group">
        <button
          type="button"
          className="room-btn-save"
          onClick={handleSubmit}
          aria-label="Lưu phòng mới"
        >
          Lưu
        </button>
        <button
          type="button"
          className="room-btn-cancel"
          onClick={onCancel}
          aria-label="Hủy thêm phòng"
        >
          Hủy
        </button>
      </div>
    </div>
  );
};

const RoomList = ({ rooms, onRoomChange, boardingHouseId }) => {
  const [isAddingRoom, setIsAddingRoom] = useState(false);
  const navigate = useNavigate();
  const { token } = useAuth();

  useEffect(() => {
    if (!boardingHouseId) setIsAddingRoom(false);
  }, [boardingHouseId]);

  const handleRoomAction = async (action, roomId) => {
    if (!roomId) {
      toast.warn('ID phòng không hợp lệ!');
      return;
    }
    try {
      switch (action) {
        case 'delete':
          await deleteRoom(boardingHouseId, roomId, token);
          onRoomChange?.(rooms.filter((room) => room.id !== roomId));
          toast.success('Xóa phòng thành công!');
          break;
        case 'update':
          navigate(
            ROUTERS.USER.PROFILE.replace('*', '') +
              ROUTERS.USER.ROOMS.UPDATE.replace(':id', roomId)
          );
          break;
        case 'payment':
          navigate(
            ROUTERS.USER.PROFILE.replace('*', '') +
              ROUTERS.USER.ROOMS.PAYMENT_HISTORY.replace(':id', roomId)
          );
          break;
        default:
          break;
      }
    } catch (error) {
      console.error(`Lỗi khi ${action}:`, error.response?.data || error);
      toast.error(error.response?.data?.message || `Không thể ${action} phòng!`);
    }
  };

  const handleAddRoom = (newRoom) => {
    onRoomChange?.([...rooms, newRoom]);
    setIsAddingRoom(false);
  };

  return (
    <div className="room-list" data-testid="room-list">
      <button
        className="btn-add-room"
        onClick={() => setIsAddingRoom(true)}
        aria-label="Thêm phòng mới"
      >
        Thêm phòng
      </button>

      {isAddingRoom && (
        <NewRoomForm
          boardingHouseId={boardingHouseId}
          onSave={handleAddRoom}
          onCancel={() => setIsAddingRoom(false)}
        />
      )}

      {rooms.map((room) => (
        <div
          key={room.id}
          className="room-item"
          data-testid={`room-item-${room.id}`}
        >
          <div className="room-grid">
            <div className="room-info">
              <label>Tên phòng:</label>
              <span>{room.name || 'Chưa có tên'}</span>
            </div>
            <div className="room-info">
              <label>Diện tích:</label>
              <span>{room.area ? `${room.area} m²` : '0 m²'}</span>
            </div>
            <div className="room-info">
              <label>Tiền thuê:</label>
              <span>{room.price ? `${room.price} VND` : '0 VND'}</span>
            </div>
            <div className="room-info">
              <label>Số người tối đa:</label>
              <span>{room.capacity || '0'} người</span>
            </div>
            <div className="room-info">
              <label>Tầng:</label>
              <span>{room.floor || '1'}</span>
            </div>
          </div>
          <div className="button-group">
            <button
              type="button"
              className="room-btn-remove"
              onClick={() => handleRoomAction('delete', room.id)}
              aria-label="Xóa phòng"
            >
              Xóa
            </button>
            <button
              type="button"
              className="room-btn-update"
              onClick={() => handleRoomAction('update', room.id)}
              aria-label="Cập nhật phòng"
            >
              Cập nhật
            </button>
            <button
              type="button"
              className="room-btn-payment"
              onClick={() => handleRoomAction('payment', room.id)}
              aria-label="Xem lịch sử thanh toán"
            >
              Lịch sử thanh toán
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default RoomList;