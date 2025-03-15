// src/components/PostItem.jsx
import React from 'react';
import './style.scss';
import { Link } from 'react-router-dom';
import { ROUTERS } from '../../../../utils/router/Router';
import { formatDate } from '../../../../utils/DateTimeUtils';
import imageDefault from '../../../../assets/images/defaultAvatar.jpg';
import { LuMapPin } from "react-icons/lu";
const SearchPostItem = ({ post }) => {
  const { id, title, imageUrl, area, roomRent, address, modifiedDate } = post;

  return (
    <Link className="search__post__item" to={ROUTERS.USER.POST_DETAIL.replace(':id', id)}>
      <div className="post__content">
        <img className="image__item" src={imageUrl} alt={title || 'Hình ảnh'} />
        <div className="post__details">
          <p className="post__title">{title || 'Không có tiêu đề'}</p>
          <p className="post__price">{roomRent ? `${roomRent} VNĐ` : 'Không có giá'}</p>
          <p className="post__area">{area ? `${area} m²` : 'Không có diện tích'}</p>
          <div className="post__address">
            <LuMapPin/>
            <p> {address || 'Không có địa chỉ'}</p>
          </div>
          <div className="post__author">
            <div className="author__avatar">
              <img src={imageDefault} alt="" />
            </div>
            <div className="author__information">
            <div className="author__name">Người đăng</div>
            <p className="post__date">{formatDate(modifiedDate) || 'Không có ngày'}</p>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default SearchPostItem;