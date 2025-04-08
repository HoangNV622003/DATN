import React, { useState } from 'react';
import './style.scss';

const FindRoommatePopup = ({ isOpen, onClose, onSubmit, isLoading }) => {
  const [title, setTitle] = useState('');
  const [image, setImage] = useState(null); // State để lưu file hình ảnh
  const [imagePreview, setImagePreview] = useState(null); // State để hiển thị preview

  if (!isOpen) return null;

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      setImagePreview(URL.createObjectURL(file)); // Tạo URL để hiển thị preview
    }
  };

  const handleSubmit = () => {
    if (title.trim()) {
      onSubmit({ title, image }); // Gửi cả tiêu đề và hình ảnh
      setTitle('');
      setImage(null);
      setImagePreview(null); // Reset sau khi gửi
    }
  };

  const handleRemoveImage = () => {
    setImage(null);
    setImagePreview(null); // Xóa hình ảnh và preview
  };

  return (
    <div className="popup-overlay" onClick={onClose}>
      <div className="popup-content" onClick={(e) => e.stopPropagation()}>
        <h3>Đăng tin tìm người ở ghép</h3>
        <div className="form-group">
          <label>Tiêu đề bài viết:</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Nhập tiêu đề"
            className="title-input"
            disabled={isLoading}
          />
        </div>
        <div className="form-group">
          <label>Thêm hình ảnh:</label>
          <input
            type="file"
            accept="image/*" // Chỉ chấp nhận file hình ảnh
            onChange={handleImageChange}
            className="image-input"
            disabled={isLoading}
          />
          {imagePreview && (
            <div className="image-preview">
              <img src={imagePreview} alt="Preview" />
              <button
                className="btn-remove-image"
                onClick={handleRemoveImage}
                disabled={isLoading}
              >
                Xóa
              </button>
            </div>
          )}
        </div>
        <div className="popup-buttons">
          <button className="btn-cancel" onClick={onClose} disabled={isLoading}>
            Hủy
          </button>
          <button
            className="btn-submit"
            onClick={handleSubmit}
            disabled={isLoading || !title.trim()}
          >
            {isLoading ? 'Đang đăng...' : 'Đăng tin'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default FindRoommatePopup;