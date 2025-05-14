import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import "./style.scss";
import { ROUTERS } from '../../../../utils/router/Router';
import { existedUser } from '../../../../apis/account/UserService';
import { toast } from 'react-toastify';


const RegisterForm = () => {
    const navigate=useNavigate();
    const [formData, setFormData] = useState({
        username: '',
        password: '',
        firstName: '',
        lastName: '',
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
        const payload = {
            username: formData.username,
            phone: formData.phone,
            email: formData.email,
        }
        existedUser(payload)
            .then((response) => {
                if(response.data>0){
                    toast.error("Tài khoản đã tồn tại, vui lòng thử lại");
                    return;
                }else{
                    localStorage.setItem('userRegister', JSON.stringify(formData));
                    navigate(ROUTERS.AUTH.VERIFY_OTP);
                }
            })
            .catch((error) => {
                toast.error(error.response?.data?.message || "Có lỗi xảy ra, vui lòng thử lại sau");
            });
        
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
                            name="firstName"
                            placeholder="Họ"
                            value={formData.firstName}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <input
                            type="text"
                            name="lastName"
                            placeholder="Tên"
                            value={formData.lastName}
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
                        <Link to={ROUTERS.AUTH.LOGIN}>Bạn đã có tài khoản ư?</Link>
                    </div>
                </div>
            </form>
        </div>
    );
};

export default RegisterForm;