import React, { memo, useState } from 'react';
import "./style.scss";
import { Link, useNavigate } from 'react-router-dom';
import { ROUTERS } from '../../utils/router/Router';
import { BsChevronDown } from "react-icons/bs";
import defautAvatar from '../../assets/images/logo512.png';

const ProfileMenu = ({ id, username, fullname, imageUrl }) => {
  const navigate = useNavigate();
  const [isPostOpen, setIsPostOpen] = useState(false);
  const [isBoardingOpen, setIsBoardingOpen] = useState(false);

  const handleNavigateToCreatePost = () => {
    navigate(`${ROUTERS.USER.PROFILE.replace("*","")+ROUTERS.USER.POST.CREATE}`);
  };
  const handleNavigateToMyProfile = () => {
    navigate(`${ROUTERS.USER.PROFILE.replace("/*","")}`);
  }
  const handleNavigateToMyPost = () => {
    navigate(`${ROUTERS.USER.PROFILE.replace("*","")+ROUTERS.USER.POST.MANAGEMENT}`);
  }
  const handleNavigateToMyBoardingHouse = () => {
    navigate(`${ROUTERS.USER.PROFILE.replace("*","")+ROUTERS.USER.BOARDING_HOUSE.MANAGEMENT}`);
  }
  const handleNavigateToMyBoardingHouseForRent = () => {
    navigate(`${ROUTERS.USER.PROFILE.replace("*","")+ROUTERS.USER.ROOMS.MANAGEMENT}`);
  }

  return (
    <div className='profile-menu'>
      <div className="profile-header">
        <img src={imageUrl || defautAvatar} alt={fullname || 'Profile'} />
        <h3>{fullname || "Người dùng"}</h3>
      </div>
      
      <nav className="profile-nav">
        <p onClick={handleNavigateToMyProfile}>Thông tin cá nhân</p>
      </nav>
      
      <nav className="post-nav">
        <div onClick={() => setIsPostOpen(!isPostOpen)}>
          <p>Quản lý bài đăng</p>
          <BsChevronDown className={isPostOpen ? 'active' : ''}/>
        </div>
        <ul className={isPostOpen ? 'active' : ''}>
          <li onClick={handleNavigateToCreatePost}>
            <p>Đăng tin</p>
          </li>
          <li onClick={handleNavigateToMyPost}>
            <p>Bài đăng của tôi</p>
          </li>
        </ul>
      </nav>
      
      <nav className="boarding-house-nav">
        <div onClick={() => setIsBoardingOpen(!isBoardingOpen)}>
          <p>Quản lý nhà trọ</p>
          <BsChevronDown className={isBoardingOpen ? 'active' : ''}/>
        </div>
        <ul className={isBoardingOpen ? 'active' : ''}>
          <li onClick={handleNavigateToMyBoardingHouse}>
            <p>Đang thuê</p>
          </li>
          <li onClick={handleNavigateToMyBoardingHouseForRent}>
            <p>Đang cho thuê</p>
          </li>
        </ul>
      </nav>
    </div>
  );
};

export default memo(ProfileMenu);