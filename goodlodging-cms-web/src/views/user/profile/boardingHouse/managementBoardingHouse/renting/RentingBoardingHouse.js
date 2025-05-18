import React, { useEffect, useState } from 'react';
import './style.scss';
import { addUserToRoom, fetchMyRoom, removeUserFromRoom } from '../../../../../../apis/room/RoomService';
import { useAuth } from '../../../../../../context/AuthContext';
import defaultAvatar from '../../../../../../assets/images/defaultAvatar.jpg';
import { useNavigate } from 'react-router-dom';
import { ROUTERS } from '../../../../../../utils/router/Router';
import { toast } from 'react-toastify';
import FindRoommatePopup from '../../../../../../components/popup/findRoomMatePopup/FindRoomMatePopup';
import { findRoomMate } from '../../../../../../apis/posts/PostService';
import { IMAGE_URL } from '../../../../../../utils/ApiUrl';
import DeleteConfirmPopup from '../../../../../../components/popup/deleteConfirmPopup/DeleteConfirmPopup';

const RentingBoardingHouse = () => {
  const [data, setData] = useState(null);
  const [isFindRoommatePopupOpen, setIsFindRoommatePopupOpen] = useState(false);
  const [isDeleteConfirmPopupOpen, setIsDeleteConfirmPopupOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [usernameInput, setUsernameInput] = useState(''); // State cho input username
  const { user, token, isLogin, loading } = useAuth();
  const navigate = useNavigate();

  const handleFetchData = async (userId, accessToken) => {
    try {
      const result = await fetchMyRoom(userId, accessToken);
      if (!result || !result.data) {
        setData(null);
      } else {
        setData(result.data);
      }
    } catch (err) {
      console.log('Lỗi khi tải thông tin phòng trọ:', err);
      toast.error('Lỗi khi tải thông tin phòng trọ!');
    }
  };

  useEffect(() => {
    if (!loading) {
      if (!user || !isLogin) {
        toast.error('Vui lòng đăng nhập để tiếp tục');
        navigate(ROUTERS.AUTH.LOGIN);
      } else {
        handleFetchData(user.id, token);
      }
    }
  }, [isLogin, loading, user, navigate, token]);

  if (!data) {
    return <div className="room-info-container">Bạn chưa thuê phòng trọ nào</div>;
  }

  const { roomDetail, host, boardingHouse } = data;

  const handleNavigateToAuthorPosts = () => {
    navigate(ROUTERS.USER.AUTHOR_POST.replace(':id', host.id));
  };

  const handleFindRoommate = () => {
    const currentUsers = roomDetail.users.length;
    const maxCapacity = roomDetail.room.capacity;

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
    payload.append('roomId', roomDetail.room.id);
    payload.append('userId', host.id);
    payload.append('boardingHouseId', boardingHouse.id);
    payload.append('imageFile', image);
    try {
      const response = await findRoomMate(payload, token);
      toast.success(response.data.result || 'Đã đăng tin tìm người ở ghép thành công');
    } catch (error) {
      toast.error(error.message || 'Đăng tin thất bại!');
    } finally {
      setIsLoading(false);
      setIsFindRoommatePopupOpen(false);
    }
  };

  const handleCloseFindRoommatePopup = () => {
    setIsFindRoommatePopupOpen(false);
  };

  const handleOpenDeleteConfirmPopup = () => {
    setIsDeleteConfirmPopupOpen(true);
  };

  const handleCloseDeleteConfirmPopup = () => {
    setIsDeleteConfirmPopupOpen(false);
  };

  const handleLeaveRoom = async () => {
    setIsLoading(true);
    const payload = {
      userId: user.id,
      roomId: roomDetail.room.id,
    };
    try {
      await removeUserFromRoom(payload, token);
      toast.success('Rời khỏi phòng thành công!');
      setData(null);
      navigate(ROUTERS.USER.HOME);
    } catch (error) {
      toast.error(error.message || 'Rời khỏi phòng thất bại!');
    } finally {
      setIsLoading(false);
      setIsDeleteConfirmPopupOpen(false);
    }
  };

  const handleAddMember = async () => {
    if (!usernameInput.trim()) {
      toast.error('Vui lòng nhập username!');
      return;
    }

    const currentUsers = roomDetail.users.length;
    const maxCapacity = roomDetail.room.capacity;

    if (currentUsers >= maxCapacity) {
      toast.error('Phòng đã đủ người, không thể thêm thành viên!');
      return;
    }

    setIsLoading(true);
    const payload = {
      roomId: roomDetail.room.id,
      username: usernameInput.trim(),
    };

    try {
      await addUserToRoom(payload, token);
      toast.success('Thêm thành viên thành công!');
      await handleFetchData(user.id, token); // Cập nhật danh sách người thuê
      setUsernameInput(''); // Xóa input
    } catch (error) {
      toast.error(error.message || 'Thêm thành viên thất bại!');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="room-info-container">
      {/* Thông tin phòng */}
      <section className="section">
        <h1 className="room-title">
          <h2>Thông tin phòng</h2>
          <div className="group-button">
            <button onClick={handleFindRoommate} className="btn-find">
              Tìm người ở ghép
            </button>
            <button onClick={handleOpenDeleteConfirmPopup} className="btn-leave">
              Rời khỏi phòng
            </button>
          </div>
        </h1>
        <div className="info-item"><span className="label">ID:</span> {roomDetail.room.id}</div>
        <div className="info-item"><span className="label">Tên phòng:</span> {roomDetail.room.name}</div>
        <div className="info-item"><span className="label">Mô tả:</span> {roomDetail.room.description}</div>
        <div className="info-item"><span className="label">Sức chứa:</span> {roomDetail.room.capacity} người</div>
        <div className="info-item"><span className="label">Diện tích:</span> {roomDetail.room.area} m²</div>
        <div className="info-item"><span className="label">Tầng:</span> {roomDetail.room.floor}</div>
        <div className="info-item"><span className="label">Tiện ích:</span> {boardingHouse.features}</div>
      </section>

      {/* Chi phí sinh hoạt */}
      <section className="section">
        <h2>Chi phí sinh hoạt</h2>
        <table className="expense-table">
          <thead>
            <tr>
              <th>Tên chi phí</th>
              <th>Số tiền</th>
              <th>Đơn vị</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Tiền phòng</td>
              <td>{roomDetail.room.price.toLocaleString('vi-VN')}</td>
              <td>VND/Phòng</td>
            </tr>
            <tr>
              <td>Tiền điện</td>
              <td>{boardingHouse.electricityPrice.toLocaleString('vi-VN')}</td>
              <td>VND/kWh</td>
            </tr>
            <tr>
              <td>Tiền nước</td>
              <td>{boardingHouse.waterPrice.toLocaleString('vi-VN')}</td>
              <td>VND/m³</td>
            </tr>
            <tr>
              <td>Phí sinh hoạt khác</td>
              <td>{boardingHouse.otherPrice.toLocaleString('vi-VN')}</td>
              <td>VND/Tháng</td>
            </tr>
          </tbody>
        </table>
      </section>

      {/* Danh sách người thuê */}
      <section className="section">
        <h2>Danh sách người thuê</h2>
        <label htmlFor="add-user" style={{ marginTop: '20px' }}>
          Thêm thành viên
        </label>
        <div className="add-user">
          <input
            type="text"
            placeholder="Nhập username"
            aria-label="Username người thuê"
            value={usernameInput}
            onChange={(e) => setUsernameInput(e.target.value)}
            disabled={isLoading}
          />
          <button
            className="add-btn"
            aria-label="Thêm người thuê"
            onClick={handleAddMember}
            disabled={isLoading}
          >
            {isLoading ? 'Đang xử lý...' : 'Thêm'}
          </button>
        </div>
        <table className="user-table">
          <thead>
            <tr>
              <th>Họ và tên</th>
              <th>Email</th>
              <th>Số điện thoại</th>
              <th>Ngày sinh</th>
              <th>Thời gian thuê</th>
            </tr>
          </thead>
          <tbody>
            {roomDetail.users.map((user) => (
              <tr key={user.id}>
                <td>{user.fullName}</td>
                <td>{user.email}</td>
                <td>{user.phone}</td>
                <td>{new Date(user.birthday).toLocaleDateString('vi-VN')}</td>
                <td>{new Date(user.updatedAt).toLocaleDateString('vi-VN')}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      {/* Thông tin chủ trọ */}
      <section className="section">
        <h2>Thông tin chủ trọ</h2>
        <div className="container__host">
          <img src={host.imageUrl ? IMAGE_URL + host.imageUrl : defaultAvatar} alt="Host Avatar" />
          <div className="container__host__information" onClick={handleNavigateToAuthorPosts}>
            <div className="info-item"><span className="label">Tên:</span> {host.firstName} {host.lastName}</div>
            <div className="info-item"><span className="label">Email:</span> {host.email}</div>
            <div className="info-item"><span className="label">Số điện thoại:</span> {host.phone}</div>
          </div>
        </div>
      </section>

      {/* Popup tìm người ở ghép */}
      <FindRoommatePopup
        isOpen={isFindRoommatePopupOpen}
        onClose={handleCloseFindRoommatePopup}
        onSubmit={handleSubmitPost}
        isLoading={isLoading}
      />

      {/* Popup xác nhận rời phòng */}
      <DeleteConfirmPopup
        isOpen={isDeleteConfirmPopupOpen}
        onClose={handleCloseDeleteConfirmPopup}
        onConfirm={handleLeaveRoom}
        message="Bạn có chắc chắn muốn rời khỏi phòng này không?"
      />
    </div>
  );
};

export default RentingBoardingHouse;