// src/components/Header.jsx
import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { RiHome2Line } from "react-icons/ri";
import { CiHeart } from "react-icons/ci";
import { CiUser } from "react-icons/ci";
import { Link } from "react-router-dom";
import "./style.scss";
import { ROUTERS } from "../../utils/router/Router";
import { useAuth } from "../../context/AuthContext";
import { toast } from "react-toastify";
import { IMAGE_URL } from "../../utils/ApiUrl";

const Header = () => {
    const { user, isLogin, loading } = useAuth(); // Thêm loading để kiểm tra
    const navigate = useNavigate();

    const handleNavigateToLogin = () => {
        navigate(ROUTERS.AUTH.LOGIN);
    };

    const handleNavigateToProfile = () => {
        navigate(ROUTERS.USER.PROFILE.replace("/*", ""));
    };

    const handleHomeClick = () => {
        navigate("/"); // Điều hướng về trang chủ
    };
    const handleNavigateToFavoritePost = () => {
        if (isLogin) {
            navigate(ROUTERS.USER.FAVORITE_POST);
        } else {
            toast.error("Vui lòng đăng nhập để thực hiện chức năng này")
        }
    }
    const handleNavigateToCreatePost = () => {
        if (isLogin) {
            navigate(ROUTERS.USER.PROFILE.replace("*", "") + ROUTERS.USER.POST.CREATE)
        } else {
            toast.error("Vui lòng đăng nhập để thực hiện chức năng này")
        }
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
                    <button className="header__button" onClick={handleNavigateToCreatePost}>Đăng Tin</button>
                    {isLogin && user ? (
                        <div className="header__buttons">

                            <button className="header__button" onClick={handleNavigateToProfile}>
                                {user.imageUrl !== null
                                    ? <img src={IMAGE_URL + user.imageUrl} alt="Avatar" className="header__avatar" />
                                    : <CiUser className="header__icon__account" />}

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