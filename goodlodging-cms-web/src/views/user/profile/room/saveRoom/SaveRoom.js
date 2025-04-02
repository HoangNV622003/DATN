import React, { useState, useEffect } from 'react';
import './style.scss';
import UserList from '../../../../../components/user/userList/UserList';
import { getRoom, updateRoom, addUserToRoom, removeUserFromRoom } from '../../../../../apis/room/RoomService';
import { useParams } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useAuth } from '../../../../../context/AuthContext';

function SaveRoom() {
  const [savedRoom, setSavedRoom] = useState({ id: '', name: '', description: '', price: null, capacity: '', area: '', floor: '' }); // Dữ liệu đã lưu
  const [room, setRoom] = useState({ id: '', name: '', description: '', price: null, capacity: '', area: '', floor: '' }); // Dữ liệu đang chỉnh sửa
  const [users, setUsers] = useState([]);
  const [newUsername, setNewUsername] = useState('');
  const { id } = useParams();
  const {token}=useAuth();
  // Load dữ liệu phòng khi component mount
  useEffect(() => {
    getRoom(id,token)
      .then(response => {
        setSavedRoom(response.data.room); // Lưu dữ liệu đã lưu
        setRoom(response.data.room); // Dữ liệu để chỉnh sửa
        setUsers(response.data.users);
      })
      .catch(error => {
        console.error('Lỗi khi lấy dữ liệu phòng:', error);
        toast.error('Lỗi khi lấy dữ liệu phòng!');
      });
  }, [id]);

  // Xử lý cập nhật thông tin phòng
  const handleUpdateRoom = () => {
    const updatedRoom = {
      ...room,
      price: room.price || null,
      area: parseInt(room.area),
      capacity: parseInt(room.capacity),
      floor: parseInt(room.floor),
    };

    const currentUsersCount = users.length;
    const newCapacity = parseInt(room.capacity) || 0;
    if (newCapacity < currentUsersCount) {
      toast.error(`Số người tối đa (${newCapacity}) không được nhỏ hơn số người hiện tại (${currentUsersCount})!`);
      return;
    }

    updateRoom(id, updatedRoom,token)
      .then(() => {
        setSavedRoom(updatedRoom); // Cập nhật dữ liệu đã lưu khi thành công
        setRoom(updatedRoom);
        toast.success('Đã cập nhật thông tin phòng!');
      })
      .catch(error => {
        console.error('Lỗi khi cập nhật phòng:', error);
        toast.error('Lỗi khi cập nhật phòng!');
      });
  };

  // Xử lý thêm người dùng
  const handleAddUser = () => {
    const currentCapacity = parseInt(savedRoom.capacity) || 0; // Dùng capacity đã lưu
    if (users.length >= currentCapacity) {
      toast.warn('Phòng đã đủ số người tối đa!');
      return;
    }
    if (!newUsername.trim()) {
      toast.warn('Vui lòng nhập username!');
      return;
    }
    const payload = {
      roomId: id,
      username: newUsername,
    };
    addUserToRoom(payload,token)
      .then(response => {
        setUsers([...users, response.data]);
        setNewUsername('');
        toast.success('Đã thêm người dùng!');
      })
      .catch(error => {
        const errorData = error.response?.data;
        if (errorData && errorData.message) {
          toast.error(errorData.message);
        } else {
          toast.error('Có lỗi xảy ra khi thêm người dùng!');
        }
        console.error('Lỗi khi thêm người dùng:', error);
      });
  };

  // Xử lý xóa người dùng
  const handleDeleteUser = (userId) => {
    const payload = {
      userId: userId,
      roomId: id,
    };
    removeUserFromRoom(payload,token)
      .then(() => {
        setUsers(users.filter(user => user.id !== userId));
        toast.success('Đã xóa người dùng khỏi phòng!');
      })
      .catch(error => {
        const errorData = error.response?.data;
        if (errorData && errorData.message) {
          toast.error(errorData.message);
        } else {
          toast.error('Có lỗi xảy ra khi xóa người dùng!');
        }
        console.error('Lỗi khi xóa người dùng:', error);
      });
  };

  // Xử lý thay đổi input của phòng
  const handleRoomChange = (e) => {
    const { name, value } = e.target;
    setRoom({ ...room, [name]: value });
  };

  const isFull = users.length >= parseInt(savedRoom.capacity || 0); // Dùng capacity đã lưu để kiểm tra

  return (
    <div className="save-room">
      <div className="room-info">
        <h2>Thông tin phòng trọ</h2>
        <div className="room-field">
          <span>ID:</span>
          <span>{room.id}</span>
        </div>
        <label className="room-field">
          <span>Tên phòng:</span>
          <input type="text" name="name" value={room.name} onChange={handleRoomChange} />
        </label>
        <label className="room-field">
          <span>Mô tả:</span>
          <input type="text" name="description" value={room.description} onChange={handleRoomChange} />
        </label>
        <label className="room-field">
          <span>Giá (VND):</span>
          <input type="number" name="price" value={room.price || ''} onChange={handleRoomChange} />
        </label>
        <label className="room-field">
          <span>Diện tích (m²):</span>
          <input type="number" name="area" value={room.area} onChange={handleRoomChange} />
        </label>
        <label className="room-field">
          <span>Số người tối đa:</span>
          <input type="number" name="capacity" value={room.capacity} onChange={handleRoomChange} />
        </label>
        <label className="room-field">
          <span>Tầng:</span>
          <input type="number" name="floor" value={room.floor} onChange={handleRoomChange} />
        </label>
        <button className="update-btn" onClick={handleUpdateRoom}>Cập nhật phòng</button>
      </div>

      <div className="users-section">
        <h2>Danh sách người thuê ({users.length}/{savedRoom.capacity || 0})</h2> {/* Hiển thị capacity đã lưu */}
        <div className="add-user">
          <input
            type="text"
            placeholder="Nhập username"
            value={newUsername}
            onChange={(e) => setNewUsername(e.target.value)}
            disabled={isFull}
          />
          <button
            className="add-btn"
            onClick={handleAddUser}
            disabled={isFull}
          >
            Thêm người thuê
          </button>
        </div>
        <UserList users={users} onDelete={handleDeleteUser} />
      </div>
      <ToastContainer />
    </div>
  );
}

export default SaveRoom;