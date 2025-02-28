import React, { useState } from 'react';
import { Link } from 'react-router-dom';

function ForgotPassword() {
  const [email, setEmail] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    // Giả lập gửi email reset mật khẩu
    alert(`Link reset mật khẩu đã được gửi đến ${email}`);
  };

  return (
    <div className="auth-container">
      <h2>Quên mật khẩu</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Email:</label>
          <input 
            type="email" 
            value={email} 
            onChange={(e) => setEmail(e.target.value)} 
            required 
          />
        </div>
        <button type="submit">Gửi mã OTP</button>
      </form>
      <p>
        Quay lại <Link to="/login">Đăng nhập</Link>
      </p>
    </div>
  );
}

export default ForgotPassword;