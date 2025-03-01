import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { RiHome2Line } from "react-icons/ri";
import { CiHeart } from "react-icons/ci";
import { CiUser } from "react-icons/ci";
import { AiOutlineMessage } from "react-icons/ai";
import { Link } from "react-router-dom";
import "./style.scss";

const Header = () => {
  const navigate = useNavigate();

  const handleNavigateToLogin = () => {
    navigate("/login");
  };

  const isLogin = useState(true);
  return (
    <div className="header">
        <Link to="/" className="header__home">
          <RiHome2Line className="header__icon" aria-label="Trang chủ" />
            <p className="header__title">Trọ tốt</p>
          
        </Link>
      <div className="header__buttons">
        <button className="header__button">
          <CiHeart className="header__icon__like" aria-label="Yêu thích" />
          <p>Yêu thích</p>
        </button>
        <button className="header__button">Đăng Tin</button>
        {isLogin? (
          <div className="header__buttons">
            <button className="header__button">
              <AiOutlineMessage className="header__icon__message" />
              <p>Tin nhắn</p>
            </button>
            <button className="header__button">
              <CiUser className="header__icon__account" />
              <p>Trang cá nhân</p>
            </button>
          </div>
        ) : (
          <button className="header__button" onClick={handleNavigateToLogin}>
            Đăng Nhập
          </button>
        )}
      </div>
    </div>
  );
};

export default Header;
