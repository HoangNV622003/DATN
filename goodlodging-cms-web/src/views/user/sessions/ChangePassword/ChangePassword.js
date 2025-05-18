import React, { useState, useRef, useEffect } from "react";
import "./style.scss";
import { useAuth } from "../../../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { ROUTERS } from "../../../../utils/router/Router";
import { changePassword } from "../../../../apis/auth/AuthService";
import { toast } from "react-toastify";

const ChangePassword = () => {
  const navigate = useNavigate();
  const { user, token, isLogin, loading } = useAuth();
  const [formData, setFormData] = useState({
    oldPassword: "",
    newPassword: "",
    confirmNewPassword: "",
  });
  const oldPasswordRef = useRef(null);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  useEffect(() => {
    if (loading) return;
    if (!isLogin&& !user) {
      navigate(ROUTERS.AUTH.LOGIN);
    } else {
      oldPasswordRef.current.focus(); // Focus vào trường mật khẩu cũ khi tải
    }
  }, [loading, isLogin, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Kiểm tra validation
    if (!formData.oldPassword || !formData.newPassword || !formData.confirmNewPassword) {
      toast.error("Vui lòng điền đầy đủ tất cả các trường!");
      return;
    }

    if (formData.newPassword !== formData.confirmNewPassword) {
      toast.error("Mật khẩu mới và xác nhận mật khẩu không khớp!");
      return;
    }

    if (formData.newPassword.length < 6) {
      toast.error("Mật khẩu mới phải có ít nhất 6 ký tự!");
      return;
    }

    const payload={
      currentPassword: formData.oldPassword,
      newPassword: formData.newPassword,
      confirmPassword: formData.confirmNewPassword,
    }
    handleChangePassword(payload,token);
  };

  const handleChangePassword = async (payload,token) => {
    await changePassword(payload,token).then((response) => {
      if(response) {
        toast.success("Đổi mật khẩu thành công!").then(() => {
          setTimeout(() => {
            setFormData({
            oldPassword: "",
            newPassword: "",
            confirmNewPassword: "",
          });
            navigate(ROUTERS.AUTH.LOGIN);
          }, 2000); // Chờ 2 giây trước khi chuyển trang
        });
      }else{
        toast.error("Mật khẩu cũ không đúng!");
      }
    }).catch((error) => {
      toast.error(error.message||"Đổi mật khẩu không thành công!");
      console.error("Lỗi khi đổi mật khẩu:", error);
    })
  }
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