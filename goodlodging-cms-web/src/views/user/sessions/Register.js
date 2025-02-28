import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

function Register() {
    const navigate=useNavigate();
    const handleNavigateToLogin=()=>{
        navigate('/login')
    }
  return (
    <div className="auth-container">
      <h1>register</h1>
      <button>Tạo tài khoản</button>
      <button onClick={handleNavigateToLogin}>Đăng nhập</button>
    </div>
  );
}

export default Register;