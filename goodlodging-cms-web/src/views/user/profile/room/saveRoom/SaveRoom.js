import React, { useState, useEffect } from 'react';
import './style.scss';
import UserList from '../../../../../components/user/userList/UserList';
import { getRoom, updateRoom, addUserToRoom, removeUserFromRoom } from '../../../../../apis/room/RoomService';
import { useParams } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useAuth } from '../../../../../context/AuthContext';
import { findRoomMate } from '../../../../../apis/posts/PostService';
import FindRoommatePopup from '../../../../../components/popup/findRoomMatePopup/FindRoomMatePopup';
import DeleteConfirmPopup from '../../../../../components/popup/deleteConfirmPopup/DeleteConfirmPopup';

const RoomForm = ({ room, onChange, onSubmit, isLoading }) => (
  <section className="save-room__room-info" data-testid="save-room__room-form">
    <h2>Thông tin phòng trọ</h2>
    <div className="save-room__form-grid">
      <div className="save-room__form-group">
        <label htmlFor="save-room__room-id">ID:</label>
        <input
          id="save-room__room-name"
          type="text"
          name="name"
          value={room.id}
          placeholder="Nhập tên phòng"
          disabled
          aria-label="ID"
        />
      </div>
      <div className="save-room__form-group">
        <label htmlFor="save-room__room-name">Tên phòng:</label>
        <input
          id="save-room__room-name"
          type="text"
          name="name"
          value={room.name}
          onChange={onChange}
          placeholder="Nhập tên phòng"
          aria-label="Tên phòng"
        />
      </div>
      <div className="save-room__form-group">
        <label htmlFor="save-room__room-price">Giá (VND):</label>
        <input
          id="save-room__room-price"
          type="number"
          name="price"
          value={room.price || ''}
          onChange={onChange}
          placeholder="Nhập giá"
          aria-label="Giá phòng"
        />
      </div>
      <div className="save-room__form-group">
        <label htmlFor="save-room__room-area">Diện tích (m²):</label>
        <input
          id="save-room__room-area"
          type="number"
          name="area"
          value={room.area}
          onChange={onChange}
          placeholder="Nhập diện tích"
          aria-label="Diện tích phòng"
        />
      </div>
      <div className="save-room__form-group">
        <label htmlFor="save-room__room-capacity">Số người tối đa:</label>
        <input
          id="save-room__room-capacity"
          type="number"
          name="capacity"
          value={room.capacity}
          onChange={onChange}
          placeholder="Nhập số người"
          aria-label="Số người tối đa"
        />
      </div>
      <div className="save-room__form-group">
        <label htmlFor="save-room__room-floor">Tầng:</label>
        <input
          id="save-room__room-floor"
          type="number"
          name="floor"
          value={room.floor}
          onChange={onChange}
          placeholder="Nhập tầng"
          aria-label="Tầng"
        />
      </div>
    </div>
    <button
      className="save-room__update-btn"
      onClick={onSubmit}
      disabled={isLoading}
      aria-label="Cập nhật phòng"
    >
      {isLoading ? 'Đang cập nhật...' : 'Cập nhật phòng'}
    </button>
  </section>
);

const SaveRoom = () => {
  const [savedRoom, setSavedRoom] = useState({
    id: '',
    name: '',
    price: null,
    capacity: '',
    area: '',
    floor: '',
  });
  const [room, setRoom] = useState({
    id: '',
    name: '',
    price: null,
    capacity: '',
    area: '',
    floor: '',
  });
  const [users, setUsers] = useState([]);
  const [newUsername, setNewUsername] = useState('');
  const [isFindRoommatePopupOpen, setIsFindRoommatePopupOpen] = useState(false);
  const [isDeleteConfirmPopupOpen, setIsDeleteConfirmPopupOpen] = useState(false);
  const [userIdToDelete, setUserIdToDelete] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const { id } = useParams();
  const { user, token } = useAuth();

  useEffect(() => {
    setIsLoading(true);
    getRoom(id, token)
      .then((response) => {
        const roomData = response.data.room;
        setSavedRoom(roomData);
        setRoom(roomData);
        setUsers(response.data.users);
      })
      .catch((error) => {
        console.error('Lỗi khi lấy dữ liệu phòng:', error);
        toast.error('Lỗi khi lấy dữ liệu phòng!');
      })
      .finally(() => setIsLoading(false));
  }, [id, token]);

  const handleRoomChange = (e) => {
    const { name, value } = e.target;
    setRoom((prev) => ({ ...prev, [name]: value }));
  };

  const handleUpdateRoom = async () => {
    const updatedRoom = {
      ...room,
      price: room.price || null,
      area: parseInt(room.area) || 0,
      capacity: parseInt(room.capacity) || 0,
      floor: parseInt(room.floor) || 0,
    };

    const currentUsersCount = users.length;
    const newCapacity = parseInt(room.capacity) || 0;
    if (newCapacity < currentUsersCount) {
      toast.error(`Số người tối đa (${newCapacity}) không được nhỏ hơn số người hiện tại (${currentUsersCount})!`);
      return;
    }

    setIsLoading(true);
    try {
      await updateRoom(id, updatedRoom, token);
      setSavedRoom(updatedRoom);
      setRoom(updatedRoom);
      toast.success('Cập nhật phòng thành công!');
    } catch (error) {
      console.error('Lỗi khi cập nhật phòng:', error);
      toast.error('Lỗi khi cập nhật phòng!');
    } finally {
      setIsLoading(false);
    }
  };

  const handleUserAction = async (action, payload) => {
    try {
      switch (action) {
        case 'add':
          const currentCapacity = parseInt(savedRoom.capacity) || 0;
          if (users.length >= currentCapacity) {
            toast.warn('Phòng đã đủ số người tối đa!');
            return;
          }
          if (!payload.username.trim()) {
            toast.warn('Vui lòng nhập username!');
            return;
          }
          const addResponse = await addUserToRoom(payload, token);
          setUsers((prev) => [...prev, addResponse.data]);
          setNewUsername('');
          toast.success('Thêm người dùng thành công!');
          break;
        case 'delete':
          await removeUserFromRoom(payload, token);
          setUsers((prev) => prev.filter((user) => user.id !== payload.userId));
          toast.success('Xóa người dùng thành công!');
          break;
        default:
          break;
      }
    } catch (error) {
      const errorData = error.response?.data;
      toast.error(errorData?.message || `Lỗi khi ${action === 'add' ? 'thêm' : 'xóa'} người dùng!`);
      console.error(`Lỗi khi ${action}:`, error);
    }
  };

  const handleOpenDeleteConfirmPopup = (userId) => {
    setUserIdToDelete(userId);
    setIsDeleteConfirmPopupOpen(true);
  };

  const handleCloseDeleteConfirmPopup = () => {
    setIsDeleteConfirmPopupOpen(false);
    setUserIdToDelete(null);
  };

  const handleConfirmDelete = async () => {
    setIsLoading(true);
    try {
      const payload = { userId: userIdToDelete, roomId: id };
      await handleUserAction('delete', payload);
    } finally {
      setIsLoading(false);
      handleCloseDeleteConfirmPopup();
    }
  };

  const handleFindRoommate = () => {
    const currentUsers = users.length;
    const maxCapacity = parseInt(room.capacity) || 0;
    if (currentUsers >= maxCapacity) {
      toast.error('Phòng đã đủ người, không thể tìm thêm thành viên!');
    } else {
      setIsFindRoommatePopupOpen(true);
    }
  };

  const handleSubmitPost = async ({ title, image }) => {
    setIsLoading(true);
    const payload = new FormData();
    payload.append('title', title);
    payload.append('roomId', id);
    payload.append('userId', user.id);
    payload.append('boardingHouseId', room.boardingHouseId);
    payload.append('imageFile', image);

    try {
      await findRoomMate(payload, token);
      toast.success('Đăng tin tìm người ở ghép thành công!');
    } catch (error) {
      toast.error(error.message || 'Đăng tin thất bại!');
    } finally {
      setIsLoading(false);
      setIsFindRoommatePopupOpen(false);
    }
  };

  const isFull = users.length >= parseInt(savedRoom.capacity || 0);

  return (
    <div className="save-room" data-testid="save-room">
      <RoomForm
        room={room}
        onChange={handleRoomChange}
        onSubmit={handleUpdateRoom}
        isLoading={isLoading}
      />
      <section className="save-room__users-section">
        <div className="save-room__section-header">
          <h2>
            Danh sách người thuê{' '}
            <span className="save-room__user-count">
              ({users.length}/{savedRoom.capacity || 0})
            </span>
          </h2>
          <button
            className="save-room__find-roommate-btn"
            onClick={handleFindRoommate}
            disabled={isFull}
            aria-label="Tìm người ở ghép"
          >
            Tìm người ở ghép
          </button>
        </div>
        <div className="save-room__add-user">
          <input
            type="text"
            placeholder="Nhập username"
            value={newUsername}
            onChange={(e) => setNewUsername(e.target.value)}
            disabled={isFull}
            aria-label="Username người thuê"
          />
          <button
            className="save-room__add-btn"
            onClick={() => handleUserAction('add', { roomId: id, username: newUsername })}
            disabled={isFull}
            aria-label="Thêm người thuê"
          >
            Thêm
          </button>
        </div>
        <UserList users={users} onDelete={handleOpenDeleteConfirmPopup} />
      </section>
      <FindRoommatePopup
        isOpen={isFindRoommatePopupOpen}
        onClose={() => setIsFindRoommatePopupOpen(false)}
        onSubmit={handleSubmitPost}
        isLoading={isLoading}
      />
      <DeleteConfirmPopup
        isOpen={isDeleteConfirmPopupOpen}
        onClose={handleCloseDeleteConfirmPopup}
        onConfirm={handleConfirmDelete}
        message="Bạn có chắc chắn muốn xóa người dùng này khỏi phòng không?"
      />
      <ToastContainer />
    </div>
  );
};

export default SaveRoom;