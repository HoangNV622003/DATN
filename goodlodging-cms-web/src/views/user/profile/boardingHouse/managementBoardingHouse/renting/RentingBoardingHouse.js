import React, { useEffect, useState } from 'react';
import './style.scss';
import { fetchMyRoom } from '../../../../../../apis/room/RoomService';
import { useAuth } from '../../../../../../context/AuthContext';
import defaultAvatar from '../../../../../../assets/images/defaultAvatar.jpg';
import { BsChevronDown, BsChevronUp } from 'react-icons/bs';
import { useNavigate } from 'react-router-dom';
import { ROUTERS } from '../../../../../../utils/router/Router';
import { toast } from 'react-toastify';
import FindRoommatePopup from '../../../../../../components/popup/findRoomMatePopup/FindRoomMatePopup';
import { findRoomMate } from '../../../../../../apis/posts/PostService';
const RentingBoardingHouse = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isExpenseListVisible, setIsExpenseListVisible] = useState(false);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false); // Thêm state loading cho request
  const { user, token } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const result = await fetchMyRoom(user.id, token);
        setData(result.data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user.id, token]);

  if (loading) {
    return <div className="room-info-container">Đang tải dữ liệu...</div>;
  }

  if (error) {
    return <div className="room-info-container">Lỗi: {error}</div>;
  }

  if (!data) {
    return <div className="room-info-container">Không có dữ liệu để hiển thị</div>;
  }

  const { roomDetail, host, boardingHouse, expenses } = data;

  const totalExpenses = () => {
    return roomDetail.room.price + boardingHouse.waterPrice + boardingHouse.electricityPrice;
  };

  const toggleExpenseList = () => {
    setIsExpenseListVisible(!isExpenseListVisible);
  };

  const handleNavigateToAuthorPosts = () => {
    navigate(ROUTERS.USER.AUTHOR_POST.replace(':id', host.id));
  };

  const handleFindRoommate = () => {
    const currentUsers = roomDetail.users.length;
    const maxCapacity = roomDetail.room.capacity;

    if (currentUsers >= maxCapacity) {
      toast.error('Phòng đã đủ người, không thể tìm thêm thành viên!');
    } else {
      setIsPopupOpen(true);
    }
  };

  const handleSubmitPost = async ({title,image}) => {
    setIsLoading(true); // Bật loading
    const payload=new FormData();
    payload.append('title', title);
    payload.append('roomId', roomDetail.room.id);
    payload.append('userId', host.id);
    payload.append('boardingHouseId', boardingHouse.id);
    payload.append('imageFile', image);
    console.log('Payload:', [...payload]); // Kiểm tra toàn bộ FormData
    try {
      const response=await findRoomMate(payload,token);
      toast.success("Đã đăng tin tìm người ở ghép thành công "||response.data.result);
      console.log('Tiêu đề bài viết:', title);
    } catch (error) {
      toast.error(error.message||'Đăng tin thất bại!');
    } finally {
      setIsLoading(false); // Tắt loading
      setIsPopupOpen(false); // Đóng popup sau khi hoàn tất
    }
  };

  const handleClosePopup = () => {
    setIsPopupOpen(false);
  };

  return (
    <div className="room-info-container">
      {/* Thông tin phòng */}
      <section className="section">
        <h1 className="room-title">
          <h2>Thông tin phòng</h2>
          <button onClick={handleFindRoommate}>Tìm người ở ghép</button>
        </h1>
        <div className="info-item"><span className="label">ID:</span> {roomDetail.room.id}</div>
        <div className="info-item"><span className="label">Tên phòng:</span> {roomDetail.room.name}</div>
        <div className="info-item"><span className="label">Mô tả:</span> {roomDetail.room.description}</div>
        <div className="info-item"><span className="label">Sức chứa:</span> {roomDetail.room.capacity} người</div>
        <div className="info-item"><span className="label">Diện tích:</span> {roomDetail.room.area} m²</div>
        <div className="info-item"><span className="label">Tầng:</span> {roomDetail.room.floor}</div>
        <div className="info-item"><span className="label">Tiện ích:</span> {boardingHouse.features}</div>
        <div className="info-item"><span className="label">Thời gian bắt đầu thuê:</span></div>
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
              <td>Phí thang máy</td>
              <td>0</td>
              <td>VND/Tháng</td>
            </tr>
            <tr>
              <td>Phí sinh hoạt khác</td>
              <td>0</td>
              <td>VND/Tháng</td>
            </tr>
            <tr className="total-row">
              <td>Tổng chi phí</td>
              <td>{totalExpenses().toLocaleString('vi-VN')}</td>
              <td>VND</td>
            </tr>
          </tbody>
        </table>
      </section>

      {/* Danh sách người thuê */}
      <section className="section">
        <h2>Danh sách người thuê</h2>
        <table className="user-table">
          <thead>
            <tr>
              <th>Họ và tên</th>
              <th>Email</th>
              <th>Số điện thoại</th>
              <th>Ngày sinh</th>
            </tr>
          </thead>
          <tbody>
            {roomDetail.users.map((user) => (
              <tr key={user.id}>
                <td>{user.firstName} {user.lastName}</td>
                <td>{user.email}</td>
                <td>{user.phone}</td>
                <td>{new Date(user.birthday).toLocaleDateString('vi-VN')}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      {/* Thông tin chủ trọ */}
      <section className="section">
        <h2>Thông tin chủ trọ</h2>
        <div className="container__host">
          <img src={host.imageUrl || defaultAvatar} alt="Host Avatar" />
          <div className="container__host__information" onClick={handleNavigateToAuthorPosts}>
            <div className="info-item"><span className="label">Tên:</span> {host.firstName} {host.lastName}</div>
            <div className="info-item"><span className="label">Email:</span> {host.email}</div>
            <div className="info-item"><span className="label">Số điện thoại:</span> {host.phone}</div>
          </div>
          <button className="btn-send-message">Nhắn tin</button>
        </div>
      </section>

      {/* Thống kê chi phí với mũi tên */}
      <section className="section">
        <h2 onClick={toggleExpenseList} className="toggle-header">
          Thống kê chi phí
          {isExpenseListVisible ? <BsChevronUp /> : <BsChevronDown />}
        </h2>
        {isExpenseListVisible && (
          <div className="expense-list">
            {expenses.map((expense) => (
              <div key={expense.id} className="expense-item">
                <div className="info-item"><span className="label">Mã chi phí:</span> {expense.id}</div>
                <div className="info-item"><span className="label">Tên:</span> {expense.name}</div>
                <div className="info-item"><span className="label">Số tiền:</span> {expense.amount.toLocaleString('vi-VN')} VND</div>
                <div className="info-item"><span className="label">Ngày thanh toán:</span> {new Date(expense.paymentDate).toLocaleDateString('vi-VN')}</div>
                <div className="info-item"><span className="label">Hạn thanh toán:</span> {new Date(expense.dueDate).toLocaleDateString('vi-VN')}</div>
                <div className="info-item"><span className="label">Ghi chú:</span> {expense.notes}</div>
                <div className="info-item"><span className="label">Trạng thái:</span> {expense.status === 1 ? <span style={{ color: 'blue' }}>Đã thanh toán</span> : <span style={{ color: 'red' }}>Chưa thanh toán</span>}</div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Popup tìm người ở ghép */}
      <FindRoommatePopup
        isOpen={isPopupOpen}
        onClose={handleClosePopup}
        onSubmit={handleSubmitPost}
        isLoading={isLoading} // Truyền state loading vào popup
      />
    </div>
  );
};

export default RentingBoardingHouse;