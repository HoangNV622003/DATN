import React from 'react';
import './style.scss';
import { formatDate } from '../../../utils/DateTimeUtils';
import { Link, useNavigate } from 'react-router-dom';
import { ROUTERS } from '../../../utils/router/Router';
import { CiHeart } from "react-icons/ci";
import { IMAGE_URL } from '../../../utils/ApiUrl';

const PostItem = ({ post }) => {
  const navigate=useNavigate();
  const handleNavigateToDetailPost=()=>{
    navigate(ROUTERS.USER.POST_DETAIL.replace(':id', id))
  }
  const { id, title, imageUrl, area, roomRent, address, modifiedDate } = post;
  return (
    <div className="post__item">
      <div className="post__content" onClick={handleNavigateToDetailPost}>
        <img className="image__item" src={IMAGE_URL+imageUrl} alt={title || 'Hình ảnh'} />
        <div className="post__details">
          <p className="post__title">{title || 'Không có tiêu đề'}</p>
          <p className="post__price">{roomRent ? `${roomRent} VNĐ` : 'Không có giá'}</p>
          <p className="post__area">{area ? `${area} m²` : 'Không có diện tích'}</p>
          <p className="post__address">{address || 'Không có địa chỉ'}</p>
        </div>
      </div>
      <div className="container__favorite">
            <p className="post__date">{formatDate(modifiedDate) || 'Không có ngày'}</p>
            <CiHeart />
          </div>
    </div>
  );
};

export default PostItem;