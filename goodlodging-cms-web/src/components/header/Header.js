// src/components/Header.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { RiHome2Line } from "react-icons/ri";
import { CiHeart } from "react-icons/ci";
import { CiUser } from "react-icons/ci";
import { AiOutlineMessage } from "react-icons/ai";
import { Link } from "react-router-dom";
import "./style.scss";
import { getToken, removeToken, setToken } from "../../utils/service/localStorageService";
import { introspectToken } from "../../apis/auth/AuthService";
import { getUser } from "../../apis/account/UserService";
import { ROUTERS } from "../../utils/router/Router";
import { useReset } from '../../context/ResetContext';

const accessToken = getToken();

const Header = () => {
    const navigate = useNavigate();
    const { triggerReset } = useReset(); // Sử dụng Context để reset
    const [isLogin, setIsLogin] = useState(!!accessToken);
    const [user, setUser] = useState(null);

    const handleNavigateToLogin = () => {
        navigate("/login");
    };

    const handleNavigateToProfile = () => {
        navigate(ROUTERS.USER.PROFILE.replace("/*", ""));
    };

    const handleGetUser = async (id) => {
        try {
            const response = await getUser(id);
            setUser(response);
        } catch (error) {
            console.log("ERROR", error);
        }
    };

    const handleIntrospectToken = async () => {
        if (accessToken) {
            try {
                const response = await introspectToken(accessToken);
                const isValid = response.result.valid;
                if (isValid) {
                    setToken(accessToken);
                    setIsLogin(true);
                    handleGetUser();
                } else {
                    removeToken();
                    setIsLogin(false);
                }
            } catch (error) {
                removeToken();
                setIsLogin(false);
            }
        }
    };

    React.useEffect(() => {
        handleIntrospectToken();
    }, []);

    const handleHomeClick = () => {
        triggerReset(); // Kích hoạt reset khi nhấp vào "Trọ tốt"
        navigate("/");  // Điều hướng về trang chủ
    };

    return (
        <div className="header">
            <div className="header__content">
                <Link to="/" onClick={handleHomeClick} className="header__home">
                    <RiHome2Line className="header__icon" aria-label="Trang chủ" />
                    <p className="header__title">Trọ tốt</p>
                </Link>
                <div className="header__buttons">
                    <button className="header__button">
                        <CiHeart className="header__icon__like" aria-label="Yêu thích" />
                        <p>Yêu thích</p>
                    </button>
                    <button className="header__button">Đăng Tin</button>
                    {isLogin ? (
                        <div className="header__buttons">
                            <button className="header__button">
                                <AiOutlineMessage className="header__icon__message" />
                                <p>Tin nhắn</p>
                            </button>
                            <button className="header__button" onClick={handleNavigateToProfile}>
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
        </div>
    );
};

export default Header;