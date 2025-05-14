import React, { memo, useState } from 'react';
import "./style.scss";
import { Link, useNavigate } from 'react-router-dom';
import { ROUTERS } from '../../utils/router/Router';
import { BsChevronDown } from "react-icons/bs";
import defautAvatar from '../../assets/images/logo512.png';
import { useAuth } from '../../context/AuthContext';
import { IMAGE_URL } from '../../utils/ApiUrl';

const ProfileMenu = () => { // Không cần nhận props nữa
  const { user, logout } = useAuth(); // Lấy user trực tiếp từ context
  const navigate = useNavigate();
  const [isPostOpen, setIsPostOpen] = useState(false);
  const [isBoardingOpen, setIsBoardingOpen] = useState(false);
  const [isRoomRentingOpen, setIsRoomRentingOpen] = useState(false);
  const [isForRent,setIsForRent]=useState(false)
  const [isPaymentOpen,setIsPaymentOpen]=useState(false)
  const handleNavigateToCreatePost = () => {
    navigate(`${ROUTERS.USER.PROFILE.replace("*", "") + ROUTERS.USER.POST.CREATE}`);
  };
  const handleNavigateToMyProfile = () => {
    navigate(`${ROUTERS.USER.PROFILE.replace("/*", "")}`);
  };
  const handleNavigateToMyPost = () => {
    navigate(`${ROUTERS.USER.PROFILE.replace("*", "") + ROUTERS.USER.POST.MANAGEMENT}`);
  };
  const handleNavigateToMyBoardingHouseRenting = () => {
    navigate(`${ROUTERS.USER.PROFILE.replace("*", "") + ROUTERS.USER.BOARDING_HOUSE.RENTING}`);
  };
  const handleNavigateToMyBoardingHouseForRent = () => {
    navigate(`${ROUTERS.USER.PROFILE.replace("*", "") + ROUTERS.USER.BOARDING_HOUSE.FOR_RENT}`);
  };
  const handleNavigateToSaveBoardingHouse=()=>{
    navigate(`${ROUTERS.USER.PROFILE.replace("*", "") + ROUTERS.USER.BOARDING_HOUSE.CREATE}`)
  }
  const handleNavigateLogout = () => {
    logout();
    navigate(ROUTERS.AUTH.LOGIN);
  };
  const handleNavigateToManagePayment=()=>{
    navigate(`${ROUTERS.USER.PROFILE.replace("*", "") + ROUTERS.USER.BOARDING_HOUSE.MANAGEMENT_PAYMENT}`)
  }
const handleNavigateToChatPage=()=>{
        navigate(ROUTERS.USER.MESSAGE)
    }
  if (!user) return null; // Không render nếu không có user

  return (
    <div className='profile-menu'>
      <div className="profile-header">
        <img src={IMAGE_URL+ user.imageUrl || defautAvatar} alt={user.fullname || 'Profile'} />
        <h3>{user.firstName+" "+user.lastName || "Người dùng"}</h3>
      </div>
      <nav className="profile-nav">
        <p onClick={handleNavigateToMyProfile}>Thông tin cá nhân</p>
      </nav>
      <nav className="post-nav">
        <div onClick={() => setIsPostOpen(!isPostOpen)}>
          <p>Quản lý bài đăng</p>
          <BsChevronDown className={isPostOpen ? 'active' : ''} />
        </div>
        <ul className={isPostOpen ? 'active' : ''}>
          <li onClick={handleNavigateToCreatePost}><p>Đăng tin</p></li>
          <li onClick={handleNavigateToMyPost}><p>Bài đăng của tôi</p></li>
        </ul>
      </nav>
      <nav className="boarding-house-nav">
        <div onClick={() => setIsBoardingOpen(!isBoardingOpen)}>
          <p>Quản lý nhà trọ</p>
          <BsChevronDown className={isBoardingOpen ? 'active' : ''} />
        </div>
        <ul className={isBoardingOpen ? 'active' : ''}>
          <li>
            <div className="for-rent-nav" onClick={()=>setIsForRent(!isForRent)}>
              <p style={{ fontWeight: "500" }}>Đang cho thuê</p>
              <BsChevronDown className={isForRent ? 'active' : ''} />
            </div>
            <ul className={isForRent?'active':''}>
              <li onClick={handleNavigateToSaveBoardingHouse}>Thêm mới</li>
              <li onClick={handleNavigateToMyBoardingHouseForRent}>Danh sách</li>
            </ul>
          </li>
          <li>
            <div onClick={() => setIsRoomRentingOpen(!isRoomRentingOpen)}>
              <p>Đang thuê</p>
              <BsChevronDown className={isRoomRentingOpen ? "active" : ""} />
            </div>
            <ul className={isRoomRentingOpen ? 'active' : ''}>
              <li onClick={handleNavigateToMyBoardingHouseRenting}>Thông tin phòng trọ</li>
              <li onClick={handleNavigateToManagePayment}>Thống kê chi tiêu</li>
            </ul>
          </li>
        </ul>
      </nav>
      <button className="btn-chat" onClick={handleNavigateToChatPage}>Tin nhắn</button>
      <button onClick={handleNavigateLogout}>Đăng xuất</button>
    </div>
  );
};

export default memo(ProfileMenu);