import React, { useState } from 'react';
import './style.scss'; // File CSS để tùy chỉnh giao diện
import { formatCurrency,formatDate } from '../../../../../../utils/formatter/FormatUtils';
import { IMAGE_URL } from '../../../../../../utils/ApiUrl';
import { useNavigate } from 'react-router-dom';
import { ROUTERS } from '../../../../../../utils/router/Router';
import { deletePost } from '../../../../../../apis/posts/PostService';

const MyPostItem = ({ post }) => {
    const navigate =useNavigate();
    const [error,setError]=useState(null);
    const handleNavigateToDetailMyPost=()=>{
        navigate(ROUTERS.USER.PROFILE.replace("*","")+ROUTERS.USER.POST.UPDATE.replace(":postId",post.id));
    }
    const handleDeleteMyPost=async()=>{
        try {
            const response=await deletePost([post.id]);
        } catch (error) {
            setError("Lỗi khi xóa bài đăng, vui lòng thử lại sau")
        }
    }
  return (
    <div className="post-item" onClick={handleNavigateToDetailMyPost}>
      <div className="post-image">
        <img
          src={IMAGE_URL+ post.imageUrl} // Giả sử đường dẫn ảnh bắt đầu từ root
          alt={post.title}
          onError={(e) => (e.target.src = 'path/to/fallback-image.jpg')} // Ảnh dự phòng nếu lỗi
        />
      </div>
      <div className="post-details">
        <h3 className="post-title">{post.title}</h3>
        <p className="post-address">
          <strong>Địa chỉ:</strong> {post.address}
        </p>
        <p className="post-area">
          <strong>Diện tích:</strong> {post.area} m²
        </p>
        <p className="post-price">
          <strong>Giá thuê:</strong> {formatCurrency(post.roomRent)}
        </p>
        <p className="post-modified">
          <strong>Cập nhật:</strong> {formatDate(post.modifiedDate)}
        </p>
      </div>
      <button className="btn-delete" onClick={handleDeleteMyPost}>
            Xóa
      </button>
    </div>
  );
};

export default MyPostItem;