import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import "./style.scss";
import { ROUTERS } from '../../../../utils/router/Router';

const VerifyOTP = () => {
    const [otp, setOtp] = useState('');
    const navigate=useNavigate();
    const handleChange = (e) => {
        setOtp(e.target.value);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log('OTP entered:', otp);
        // Xử lý xác thực OTP tại đây

        navigate(`/${ROUTERS.AUTH.RESET_PASSWORD}`)
    };

    return (
        <div className="container__verify__otp">
            <form className="form" onSubmit={handleSubmit}>
                <h2>Xác thực OTP</h2>
                <div className="form-fields">
                    <div className="form-group">
                        <input
                            type="text"
                            name="otp"
                            placeholder="Nhập mã OTP"
                            value={otp}
                            onChange={handleChange}
                            required
                            maxLength="6" // Giới hạn 6 ký tự (thường OTP là 6 số)
                        />
                    </div>
                    <button type="submit" className="submit-btn">Xác nhận</button>
                    <div className="form-group">
                        <Link to="/forgot-password">Quay lại</Link>
                    </div>
                </div>
            </form>
        </div>
    );
};

export default VerifyOTP;