import React, { useState, useRef, useEffect } from "react";
import "./style.scss";
import { useAuth } from "../../../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { ROUTERS } from "../../../../utils/router/Router";
import { updateUser } from "../../../../apis/account/UserService";
import { toast } from "react-toastify";
import { IMAGE_URL } from "../../../../utils/ApiUrl";
import { MdDeleteOutline } from "react-icons/md";

const ProfileContent = () => {
  const navigate = useNavigate();
  const { user, token, isLogin, loading, setUser } = useAuth();
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    gender: "",
    birthday: "",
  });
  const [imageUrl, setImageUrl] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [previewImage, setPreviewImage] = useState("");
  const [error, setError] = useState("");
  const fileInputRef = useRef(null);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  useEffect(() => {
    if (loading) return;
    if (!isLogin) {
      navigate(ROUTERS.AUTH.LOGIN);
    } else if (user) {
      setFormData({
        firstName: user.firstName || "",
        lastName: user.lastName || "",
        email: user.email || "",
        phone: user.phone || "",

        gender: user.gender || "",
        birthday: user.birthday || "",
      });
      setImageUrl(user.imageUrl || "");
      setPreviewImage(""); // Không hiển thị previewImage ban đầu
    }
  }, [loading, isLogin, navigate, user]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result); // Hiển thị hình ảnh mới
      };
      reader.readAsDataURL(file);
    }
  };

  const handleImageError = () => {
    setImageUrl(""); // Ẩn imageUrl nếu không hợp lệ
    setError("Không thể tải avatar hiện tại. Vui lòng chọn hình ảnh mới.");
  };

  const handleRemoveImage = () => {
    setImageFile(null);
    setPreviewImage("");
    fileInputRef.current.value = null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Kiểm tra bắt buộc có hình ảnh
    if (!imageUrl && !imageFile) {
      setError("Vui lòng chọn hình ảnh!");
      toast.error("Vui lòng chọn hình ảnh!");
      return;
    }

    // Tạo FormData để gửi về backend
    const data = new FormData();
    data.append("firstName", formData.firstName);
    data.append("lastName", formData.lastName);
    data.append("email", formData.email);
    data.append("phone", formData.phone);

    data.append("gender", formData.gender);
    data.append("birthday", formData.birthday);
    if (imageFile) {
      data.append("imageFile", imageFile);
    } else {
      data.append("imageUrl", imageUrl);
    }

    try {
      const response = await updateUser(user.id, data, token);
      if (response.status === 200) {
        const updatedUser = response.data;
        setUser({
          ...user,
          id: updatedUser.id,
          username: updatedUser.username,
          firstName: updatedUser.firstName,
          lastName: updatedUser.lastName,
          email: updatedUser.email,
          phone: updatedUser.phone,

          gender: updatedUser.gender,
          imageUrl: updatedUser.imageUrl,
          birthday: updatedUser.birthday,
        });
        setImageUrl(updatedUser.imageUrl || "");
        setImageFile(null); // Xóa imageFile để hiển thị imageUrl
        setPreviewImage(""); // Xóa previewImage
        fileInputRef.current.value = null;
        toast.success("Cập nhật thông tin thành công!");
        setError("");
      } else {
        const errorData = await response.data;
        setError(errorData.message || "Có lỗi xảy ra khi cập nhật thông tin!");
        toast.error(errorData.message || "Có lỗi xảy ra khi cập nhật thông tin!");
      }
    } catch (err) {
      setError("Đã có lỗi xảy ra. Vui lòng thử lại.");
      toast.error("Đã có lỗi xảy ra. Vui lòng thử lại.");
      console.error("Error updating user:", err);
    }
  };

  return (
    <div className="profile-content-container">
      <div className="profile-content-card">
        <h2 className="profile-content-title">Hồ sơ người dùng</h2>
        <form onSubmit={handleSubmit} className="profile-content-form">
          <div className="form-group">
            <label htmlFor="firstName">Họ</label>
            <input
              type="text"
              id="firstName"
              name="firstName"
              value={formData.firstName}
              onChange={handleInputChange}
              className="form-control"
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="lastName">Tên</label>
            <input
              type="text"
              id="lastName"
              name="lastName"
              value={formData.lastName}
              onChange={handleInputChange}
              className="form-control"
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              className="form-control"
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="phone">Số điện thoại</label>
            <input
              type="tel"
              id="phone"
              name="phone"
              value={formData.phone}
              onChange={handleInputChange}
              className="form-control"
            />
          </div>
         
          <div className="form-group">
            <label htmlFor="gender">Giới tính</label>
            <select
              id="gender"
              name="gender"
              value={formData.gender}
              onChange={handleInputChange}
              className="form-control"
            >
              <option value="">Chọn giới tính</option>
              <option value="MALE">Nam</option>
              <option value="FEMALE">Nữ</option>
              <option value="OTHER">Khác</option>
            </select>
          </div>
          <div className="form-group">
            <label htmlFor="birthday">Ngày sinh</label>
            <input
              type="date"
              id="birthday"
              name="birthday"
              value={formData.birthday}
              onChange={handleInputChange}
              className="form-control"
            />
          </div>
          <div className="form-group">
            <label>Ảnh đại diện</label>
            {imageUrl && !imageFile && (
              <div className="image-preview">
                <img
                  src={IMAGE_URL + imageUrl}
                  alt="User avatar"
                  onError={handleImageError}
                />
              </div>
            )}
            {previewImage && imageFile && (
              <div className="image-preview">
                <div className="image-wrapper">
                  <img src={previewImage} alt="New image preview" />
                  <button
                    type="button"
                    className="remove-image-icon"
                    onClick={handleRemoveImage}
                    title="Xóa hình ảnh"
                  >
                    <MdDeleteOutline size={24} color="#ff0000" />
                  </button>
                </div>
              </div>
            )}
            {!imageUrl && !imageFile && (
              <p className="no-image-message">Chưa có hình ảnh. Vui lòng chọn một hình ảnh.</p>
            )}
            <input
              type="file"
              id="image"
              accept="image/*"
              onChange={handleImageChange}
              className="form-control"
              ref={fileInputRef}
            />
          </div>
          {error && <p className="error-message">{error}</p>}
          <div className="form-group">
            <div className="btn-group">
                <button type="submit" className="profile-content-button">
                Lưu thay đổi
                </button>
                <button type='button' className="btn-change-password" onClick={()=> navigate(ROUTERS.AUTH.CHANGE_PASSWORD)}>
                    Đổi mật khẩu
                </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProfileContent;