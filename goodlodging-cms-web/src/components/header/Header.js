// src/components/Header.jsx
import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { RiHome2Line } from "react-icons/ri";
import { CiHeart } from "react-icons/ci";
import { CiUser } from "react-icons/ci";
import { AiOutlineMessage } from "react-icons/ai";
import { Link } from "react-router-dom";
import "./style.scss";
import { ROUTERS } from "../../utils/router/Router";
import { useAuth } from "../../context/AuthContext";

const Header = () => {
    const { user, isLogin, loading } = useAuth(); // Thêm loading để kiểm tra
    const navigate = useNavigate();

    const handleNavigateToLogin = () => {
        navigate("/login");
    };

    const handleNavigateToProfile = () => {
        navigate(ROUTERS.USER.PROFILE.replace("/*", ""));
    };

    const handleHomeClick = () => {
        navigate("/"); // Điều hướng về trang chủ
    };
    const handleNavigateToFavoritePost=()=>{
        navigate(ROUTERS.USER.FAVORITE_POST);
    }
    useEffect(() => {
        console.log("isLogin:", isLogin);
        console.log("user:", user);
    }, [isLogin, user]); // Debug khi trạng thái thay đổi

    if (loading) return <div>Đang tải...</div>; // Tránh render khi chưa sẵn sàng

    return (
        <div className="header">
            <div className="header__content">
                <Link to="/" onClick={handleHomeClick} className="header__home">
                    <RiHome2Line className="header__icon" aria-label="Trang chủ" />
                    <p className="header__title">Trọ tốt</p>
                </Link>
                <div className="header__buttons">
                    <button className="header__button" onClick={handleNavigateToFavoritePost}>
                        <CiHeart className="header__icon__like" aria-label="Yêu thích" />
                        <p>Yêu thích</p>
                    </button>
                    <button className="header__button">Đăng Tin</button>
                    {isLogin && user ? (
                        <div className="header__buttons">
                            <button className="header__button">
                                <AiOutlineMessage className="header__icon__message" />
                                <p>Tin nhắn</p>
                            </button>
                            <button className="header__button" onClick={handleNavigateToProfile}>
                                <CiUser className="header__icon__account" />
                                <p>{user.firstName + " " + user.lastName}</p>
                            </button>
                        </div>
                    ) : (
                        <button className="header__button" onClick={handleNavigateToLogin}>
                            Đăng Nhập
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Header;