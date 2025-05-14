import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { resetPassword } from '../../../../apis/account/UserService';
import { ROUTERS } from '../../../../utils/router/Router';
import './style.scss';

const ResetPassword = () => {
  const [email] = useState(localStorage.getItem('forgotPasswordEmail') || '');
  const [formData, setFormData] = useState({
    newPassword: '',
    confirmPassword: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isLoading) return;

    // Kiểm tra email
    if (!email) {
      toast.error('Không tìm thấy email. Vui lòng thử lại từ bước quên mật khẩu.');
      navigate(ROUTERS.AUTH.FORGOT_PASSWORD);
      return;
    }

    // Kiểm tra mật khẩu
    if (formData.newPassword !== formData.confirmPassword) {
      toast.error('Mật khẩu không khớp, vui lòng kiểm tra lại');
      return;
    }
    if (formData.newPassword.length < 8) {
      toast.error('Mật khẩu phải có ít nhất 8 ký tự');
      return;
    }

    setIsLoading(true);
    try {
      const payload = {
        email,
        password: formData.newPassword,
      };
      const response = await resetPassword(payload);
      if (!response.data?.result) {
        throw new Error(response.data?.error || response.data?.message || 'Đặt lại mật khẩu thất bại');
      }
      toast.success('Đặt lại mật khẩu thành công');
      localStorage.removeItem('forgotPasswordEmail');
      navigate(ROUTERS.AUTH.LOGIN);
    } catch (error) {
      toast.error(
        error.response?.data?.error || error.message || 'Có lỗi xảy ra, vui lòng thử lại sau'
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container__reset__password">
      <form className="form" onSubmit={handleSubmit} aria-label="Đặt lại mật khẩu">
        <h2>Đặt Lại Mật Khẩu</h2>
        <div className="form-fields">
          <div className="form-group">
            <label htmlFor="new-password-input" className="sr-only">
              Mật khẩu mới
            </label>
            <input
              id="new-password-input"
              type="password"
              name="newPassword"
              placeholder="Mật khẩu mới"
              value={formData.newPassword}
              onChange={handleChange}
              required
              disabled={isLoading}
              aria-describedby="new-password-help"
            />
            <small id="new-password-help" className="form-help">
              Mật khẩu phải có ít nhất 8 ký tự.
            </small>
          </div>
          <div className="form-group">
            <label htmlFor="confirm-password-input" className="sr-only">
              Xác nhận mật khẩu
            </label>
            <input
              id="confirm-password-input"
              type="password"
              name="confirmPassword"
              placeholder="Xác nhận mật khẩu"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
              disabled={isLoading}
              aria-describedby="confirm-password-help"
            />
            <small id="confirm-password-help" className="form-help">
              Nhập lại mật khẩu để xác nhận.
            </small>
          </div>
          <button
            type="submit"
            className="submit-btn"
            disabled={isLoading}
            aria-busy={isLoading}
          >
            {isLoading ? 'Đang cập nhật...' : 'Cập Nhật'}
          </button>
          <div className="form-group">
            <Link to={ROUTERS.AUTH.LOGIN}>Quay lại đăng nhập</Link>
          </div>
        </div>
      </form>
    </div>
  );
};

export default ResetPassword;