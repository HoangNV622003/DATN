import React, { useState, useRef, useEffect } from "react";
import "./style.scss";
import { useAuth } from "../../../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { ROUTERS } from "../../../../utils/router/Router";
import { changePassword } from "../../../../apis/account/UserService";
import { toast } from "react-toastify";

const ChangePassword = () => {
  const navigate = useNavigate();
  const { user, token, isLogin, loading } = useAuth();
  const [formData, setFormData] = useState({
    oldPassword: "",
    newPassword: "",
    confirmNewPassword: "",
  });
  const [error, setError] = useState("");
  const oldPasswordRef = useRef(null);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  useEffect(() => {
    if (loading) return;
    if (!isLogin) {
      navigate(ROUTERS.AUTH.LOGIN);
    } else {
      oldPasswordRef.current.focus(); // Focus vào trường mật khẩu cũ khi tải
    }
  }, [loading, isLogin, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    // Kiểm tra validation
    if (!formData.oldPassword || !formData.newPassword || !formData.confirmNewPassword) {
      setError("Vui lòng điền đầy đủ tất cả các trường!");
      toast.error("Vui lòng điền đầy đủ tất cả các trường!");
      return;
    }

    if (formData.newPassword !== formData.confirmNewPassword) {
      setError("Mật khẩu mới và xác nhận mật khẩu không khớp!");
      toast.error("Mật khẩu mới và xác nhận mật khẩu không khớp!");
      return;
    }

    if (formData.newPassword.length < 6) {
      setError("Mật khẩu mới phải có ít nhất 6 ký tự!");
      toast.error("Mật khẩu mới phải có ít nhất 6 ký tự!");
      return;
    }

    // try {
    //   const response = await changePassword(user.id, {
    //     oldPassword: formData.oldPassword,
    //     newPassword: formData.newPassword,
    //   }, token);

    //   if (response.status === 200) {
    //     toast.success("Đổi mật khẩu thành công!");
    //     setFormData({
    //       oldPassword: "",
    //       newPassword: "",
    //       confirmNewPassword: "",
    //     });
    //     setError("");
    //   } else {
    //     const errorData = await response.data;
    //     setError(errorData.message || "Có lỗi xảy ra khi đổi mật khẩu!");
    //     toast.error(errorData.message || "Có lỗi xảy ra khi đổi mật khẩu!");
    //   }
    // } catch (err) {
    //   setError("Đã có lỗi xảy ra. Vui lòng thử lại.");
    //   toast.error("Đã có lỗi xảy ra. Vui lòng thử lại.");
    //   console.error("Error changing password:", err);
    // }
  };

  return (
    <div className="change-password-container">
      <div className="change-password-card">
        <h2 className="change-password-title">Đổi mật khẩu</h2>
        <form onSubmit={handleSubmit} className="change-password-form">
          <div className="form-group">
            <label htmlFor="oldPassword">Mật khẩu cũ</label>
            <input
              type="password"
              id="oldPassword"
              name="oldPassword"
              value={formData.oldPassword}
              onChange={handleInputChange}
              className="form-control"
              ref={oldPasswordRef}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="newPassword">Mật khẩu mới</label>
            <input
              type="password"
              id="newPassword"
              name="newPassword"
              value={formData.newPassword}
              onChange={handleInputChange}
              className="form-control"
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="confirmNewPassword">Xác nhận mật khẩu mới</label>
            <input
              type="password"
              id="confirmNewPassword"
              name="confirmNewPassword"
              value={formData.confirmNewPassword}
              onChange={handleInputChange}
              className="form-control"
              required
            />
          </div>
          {error && <p className="error-message">{error}</p>}
          <div className="form-group">
            <button type="submit" className="change-password-button">
              Lưu thay đổi
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ChangePassword;