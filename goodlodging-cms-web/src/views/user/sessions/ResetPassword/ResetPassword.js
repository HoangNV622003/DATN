import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import "./style.scss";
import { ROUTERS } from '../../../../utils/router/Router';

const ResetPassword = () => {
    const navigate=useNavigate();
    const [formData, setFormData] = useState({
        newPassword: '',
        confirmPassword: ''
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (formData.newPassword !== formData.confirmPassword) {
            alert('Mật khẩu không khớp!');
            return;
        }
        console.log('New password data:', formData);
        // Xử lý đặt lại mật khẩu tại đây

        navigate(`/${ROUTERS.AUTH.LOGIN}`)
    };

    return (
        <div className="container__reset__password">
            <form className="form" onSubmit={handleSubmit}>
                <h2>Đặt lại mật khẩu</h2>
                <div className="form-fields">
                    <div className="form-group">
                        <input
                            type="password"
                            name="newPassword"
                            placeholder="Mật khẩu mới"
                            value={formData.newPassword}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <input
                            type="password"
                            name="confirmPassword"
                            placeholder="Xác nhận mật khẩu"
                            value={formData.confirmPassword}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <button type="submit" className="submit-btn">Cập nhật</button>
                    <div className="form-group">
                        <Link to="/login">Quay lại đăng nhập</Link>
                    </div>
                </div>
            </form>
        </div>
    );
};

export default ResetPassword;