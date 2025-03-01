import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import "./style.scss";
import { ROUTERS } from '../../../../utils/router/Router';
const JwtLogin = () => {
    const navigate=useNavigate();
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });
    
    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };
    
    const handleSubmit = (e) => {
        e.preventDefault();
        console.log('Login data:', formData);
        handleNavigateToHome();
    };

    const handleNavigateToHome=()=>{
        navigate(`/${ROUTERS.USER.HOME}`)
    }
    const handleNavigateToRegister=()=>{
        navigate(`/${ROUTERS.AUTH.REGISTER}`)
    }
    
    return (
        <div className="container__login__form">
            <form className="form" onSubmit={handleSubmit}>
                <h2>Đăng nhập</h2>
                <div className="form-fields">
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
                            type="password" 
                            name="password"
                            placeholder="Mật khẩu"
                            value={formData.password}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <button type="submit" className="submit-btn">Đăng nhập</button>
                    <div className="form-group">
                        <Link to={"/forgot-password"}>Quên mật khẩu</Link>
                    </div>
                    <hr />
                    <button className="register-btn" onClick={handleNavigateToRegister}>Tạo tài khoản mới</button>
                </div>
            </form>
        </div>
    );
};

export default JwtLogin;