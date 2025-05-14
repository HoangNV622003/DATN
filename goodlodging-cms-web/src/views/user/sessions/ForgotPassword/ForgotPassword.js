import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { sendOtp } from '../../../../apis/auth/AuthService';
import { ROUTERS } from '../../../../utils/router/Router';
import './style.scss';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setEmail(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isLoading) return;

    setIsLoading(true);
    try {
      const response = await sendOtp({ email });
      if (!response.data?.expiryTime) {
        throw new Error('Không nhận được expiryTime từ server');
      }
      localStorage.setItem('forgotPasswordEmail', email);
      navigate(`${ROUTERS.AUTH.VERIFY_OTP}?type=forgot-password`);
      toast.success('Mã OTP đã được gửi đến email của bạn');
    } catch (error) {
      toast.error(
        error.response?.data?.error || error.message || 'Có lỗi xảy ra, vui lòng thử lại sau'
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container__forgot__password">
      <form className="form" onSubmit={handleSubmit} aria-label="Quên mật khẩu">
        <h2>Quên Mật Khẩu</h2>
        <div className="form-fields">
          <div className="form-group">
            <label htmlFor="email-input" className="sr-only">
              Email
            </label>
            <input
              id="email-input"
              type="email"
              name="email"
              placeholder="Nhập email của bạn"
              value={email}
              onChange={handleChange}
              required
              disabled={isLoading}
              aria-describedby="email-help"
            />
            <small id="email-help" className="form-help">
              Nhập email đã đăng ký để nhận mã OTP.
            </small>
          </div>
          <button
            type="submit"
            className="submit-btn"
            disabled={isLoading}
            aria-busy={isLoading}
          >
            {isLoading ? 'Đang gửi...' : 'Gửi Yêu Cầu'}
          </button>
          <div className="form-group">
            <Link to={ROUTERS.AUTH.LOGIN}>Quay lại đăng nhập</Link>
          </div>
        </div>
      </form>
    </div>
  );
};

export default ForgotPassword;