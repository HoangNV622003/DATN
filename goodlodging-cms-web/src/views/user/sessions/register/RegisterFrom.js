import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import "./style.scss";
import { ROUTERS } from '../../../../utils/router/Router';


const RegisterForm = () => {
    const navigate=useNavigate();
    const [formData, setFormData] = useState({
        username: '',
        password: '',
        firstname: '',
        lastname: '',
        email: '',
        phone: '',
        gender: 'male', // Giá trị mặc định
        birthday: ''
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log('Register data:', formData);
        // Xử lý đăng ký tại đây

        navigate(`/${ROUTERS.AUTH.LOGIN}`)
    };

    return (
        <div className="container__register__form">
            <form className="form" onSubmit={handleSubmit}>
                <h2>Đăng ký</h2>
                <div className="form-fields">
                    <div className="form-group">
                        <input
                            type="text"
                            name="username"
                            placeholder="Tên người dùng"
                            value={formData.username}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <input
                            type="password"
                            name="password"
                            placeholder="Mật khẩu"
                            value={formData.password}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <input
                            type="text"
                            name="firstname"
                            placeholder="Họ"
                            value={formData.firstname}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <input
                            type="text"
                            name="lastname"
                            placeholder="Tên"
                            value={formData.lastname}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <input
                            type="email"
                            name="email"
                            placeholder="Email"
                            value={formData.email}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <input
                            type="tel"
                            name="phone"
                            placeholder="Số điện thoại"
                            value={formData.phone}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <select
                            name="gender"
                            value={formData.gender}
                            onChange={handleChange}
                            required
                        >
                            <option value="male">Nam</option>
                            <option value="female">Nữ</option>
                            <option value="other">Khác</option>
                        </select>
                    </div>
                    <div className="form-group">
                        <input
                            type="date"
                            name="birthday"
                            value={formData.birthday}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <button type="submit" className="submit-btn">Đăng ký</button>
                    <div className="form-group">
                        <Link to="/login">Bạn đã có tài khoản ư?</Link>
                    </div>
                </div>
            </form>
        </div>
    );
};

export default RegisterForm;