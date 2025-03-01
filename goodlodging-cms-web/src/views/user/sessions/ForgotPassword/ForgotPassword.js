import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import "./style.scss";
import { ROUTERS } from '../../../../utils/router/Router';

const ForgotPassword = () => {
  const navigate=useNavigate();
    const [email, setEmail] = useState('');

    const handleChange = (e) => {
        setEmail(e.target.value);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log('Forgot password request for:', email);

        navigate(`/${ROUTERS.AUTH.VERIFY_OTP}`)
        // Xử lý gửi yêu cầu quên mật khẩu tại đây
    };

    return (
        <div className="container__forgot__password">
            <form className="form" onSubmit={handleSubmit}>
                <h2>Quên mật khẩu</h2>
                <div className="form-fields">
                    <div className="form-group">
                        <input
                            type="email"
                            name="email"
                            placeholder="Nhập email của bạn"
                            value={email}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <button type="submit" className="submit-btn">Gửi yêu cầu</button>
                    <div className="form-group">
                        <Link to="/login">Quay lại đăng nhập</Link>
                    </div>
                </div>
            </form>
        </div>
    );
};

export default ForgotPassword;