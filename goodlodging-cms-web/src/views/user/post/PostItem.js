import React from 'react';
import './style.scss';
import { formatDate } from '../../../utils/DateTimeUtils';
import { Link } from 'react-router-dom';
import { ROUTERS } from '../../../utils/router/Router';
import { CiHeart } from "react-icons/ci";
import { IMAGE_URL } from '../../../utils/ApiUrl';

const PostItem = ({ post }) => {
  const { id, title, imageUrl, area, roomRent, address, modifiedDate } = post;
  return (
    <Link className="post__item" to={ROUTERS.USER.POST_DETAIL.replace(':id', id)}>
      <div className="post__content">
        <img className="image__item" src={IMAGE_URL+imageUrl} alt={title || 'Hình ảnh'} />
        <div className="post__details">
          <p className="post__title">{title || 'Không có tiêu đề'}</p>
          <p className="post__price">{roomRent ? `${roomRent} VNĐ` : 'Không có giá'}</p>
          <p className="post__area">{area ? `${area} m²` : 'Không có diện tích'}</p>
          <p className="post__address">{address || 'Không có địa chỉ'}</p>
          <div className="container__favorite">
            <p className="post__date">{formatDate(modifiedDate) || 'Không có ngày'}</p>
            <CiHeart />
          </div>
        </div>
      </div>
    </Link>
  );
};

export default PostItem;