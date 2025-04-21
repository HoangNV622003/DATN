// src/components/JwtLogin.jsx
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import "./style.scss";
import { ROUTERS } from '../../../../utils/router/Router';
import { loginUser } from '../../../../apis/auth/AuthService';
import { useAuth } from '../../../../context/AuthContext';
const JwtLogin = () => {
    const { login } = useAuth();
    const navigate = useNavigate();
    const [payload, setPayload] = useState({
        username: '',
        password: ''
    });
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        setPayload({ ...payload, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            const response = await loginUser(payload);
            if (response.result) {
                const accessToken = response.result.accessToken;
                login(accessToken);
                navigate(`${ROUTERS.USER.HOME}`);
            }
        } catch (error) {
            setError("Tên đăng nhập hoặc mật khẩu không đúng");
        } finally {
            setLoading(false);
        }
    };

    const handleNavigateToRegister = () => {
        navigate(`/${ROUTERS.AUTH.REGISTER}`);
    };

    const handleNavigateHomepage = () => {
        navigate("/"); // Chuyển về trang chủ mà không đăng nhập
    };

    return (
        <div className="container__login__form">
            <form className="form" onSubmit={handleSubmit}>
                {loading && <div className="loading-text">Đang đăng nhập...</div>}
                <h2>Đăng nhập</h2>
                {error && <p className="error-text">{error}</p>}
                <div className="form-fields">
                    <div className="form-group">
                        <input
                            type="text"
                            name="username"
                            placeholder="Tên đăng nhập"
                            value={payload.username}
                            onChange={handleChange}
                            required
                            disabled={loading}
                        />
                    </div>
                    <div className="form-group">
                        <input
                            type="password"
                            name="password"
                            placeholder="Mật khẩu"
                            value={payload.password}
                            onChange={handleChange}
                            required
                            disabled={loading}
                        />
                    </div>
                    <button type="submit" className="submit-btn" disabled={loading}>
                        {loading ? "Đang xử lý..." : "Đăng nhập"}
                    </button>
                    <div className="form-group">
                        <Link to={"/forgot-password"}>Quên mật khẩu</Link>
                    </div>
                    <hr />
                    <button className="register-btn" onClick={handleNavigateToRegister} disabled={loading}>
                        Tạo tài khoản mới
                    </button>
                    <button onClick={handleNavigateHomepage}>Trở lại trang chủ</button>
                </div>
            </form>
        </div>
    );
};

export default JwtLogin;