import React, { useState, useRef, useEffect } from 'react';
import './style.scss';
import { Link } from 'react-router-dom';
import { ROUTERS } from '../../../../utils/router/Router';
import { formatDate } from '../../../../utils/DateTimeUtils';
import imageDefault from '../../../../assets/images/defaultAvatar.jpg';
import { LuMapPin } from "react-icons/lu";
import { BsThreeDotsVertical } from "react-icons/bs";
import { IMAGE_URL } from '../../../../utils/ApiUrl';
import { deleteFavoritePost } from '../../../../apis/favorite-posts/FavoritePostService';
import { useAuth } from '../../../../context/AuthContext';
import { CiHeart } from 'react-icons/ci';

const SearchPostItem = ({ post, showMenu = false, onPostDeleted }) => {
  const { id, title, imageUrl, area, roomRent, address, modifiedDate } = post;
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef(null);
  const {user}=useAuth();
  const handleDelete = async () => {
    try {
      console.log("delete with id=", id);
      const payload={
        userId:user.id,
        postIds:[id]
      };
      await deleteFavoritePost(payload); // Xóa bài viết
      setIsMenuOpen(false);
      if (onPostDeleted) onPostDeleted(id); // Cập nhật danh sách ở parent
    } catch (error) {
      console.error("DELETE ERROR: ", error);
      alert("Có lỗi khi xóa bài viết yêu thích");
    }
  };

  // Ẩn menu khi nhấp ra ngoài
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <Link className="search__post__item" to={ROUTERS.USER.POST_DETAIL.replace(':id', id)}>
      <div className="post__content">
        <img className="image__item" src={`${IMAGE_URL}${imageUrl}`} alt={title || 'Hình ảnh'} />
        <div className="post__details">
          <p className="post__title">{title || 'Không có tiêu đề'}</p>
          <p className="post__price">{roomRent ? `${roomRent} VNĐ` : 'Không có giá'}</p>
          <p className="post__area">{area ? `${area} m²` : 'Không có diện tích'}</p>
          <div className="post__address">
            <LuMapPin />
            <p>{address || 'Không có địa chỉ'}</p>
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
        <div className="container__favorite">
          <CiHeart />
        </div>
        {showMenu && (
          <div className="menu__container" ref={menuRef}>
            <BsThreeDotsVertical
              className="menu__icon"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                setIsMenuOpen(!isMenuOpen);
              }}
            />
            {isMenuOpen && (
              <div className="menu__popup">
                <button
                  className="delete__button"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    handleDelete();
                  }}
                >
                  Xóa khỏi danh sách
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </Link>
  );
};

export default SearchPostItem;