import React, { useState, useRef, useEffect } from 'react';
import './style.scss';
import { Link, useNavigate } from 'react-router-dom';
import { ROUTERS } from '../../../../utils/router/Router';
import { formatDate } from '../../../../utils/DateTimeUtils';
import imageDefault from '../../../../assets/images/defaultAvatar.jpg';
import { LuMapPin } from "react-icons/lu";
import { BsThreeDotsVertical } from "react-icons/bs";
import { IMAGE_URL } from '../../../../utils/ApiUrl';
import { createFavoritePost } from '../../../../apis/favorite-posts/FavoritePostService';
import { useAuth } from '../../../../context/AuthContext';
import { CiHeart } from 'react-icons/ci';
import { toast } from 'react-toastify';
import { getTitle } from '../../../../utils/PostUtils';
import { getArea, getPrice } from '../../../../utils/BoardingHouseConfig';

const SearchPostItem = ({ post, showMenu = false, onDelete }) => {
  const { id, type, title, imageUrl, maxArea, minArea, maxRent, minRent, address, modifiedDate } = post;
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef(null);
  const { user, token } = useAuth();
  const navigate = useNavigate();

  const handleDelete = (e) => {
    e.preventDefault();
    e.stopPropagation(); // Ngăn click lan truyền
    setIsMenuOpen(false);
    if (onDelete) onDelete(id); // Gọi hàm onDelete từ parent
  };

  const handleAddFavoritePost = (e) => {
    e.stopPropagation(); // Ngăn sự kiện click lan truyền lên div.post__content
    if (user === null) {
      toast.info("Vui lòng đăng nhập để thực hiện tính năng này");
    } else {
      const payload = {
        userId: user.id,
        postId: id,
      };
      createFavoritePost(payload, token)
        .then((response) => { toast.success(response.data.result || response.data.message); })
        .catch((error) => { toast.error(error.message || "Có lỗi xảy ra, vui lòng thử lại sau"); });
    }
  };

  const handleNavigateToPostDetail = () => {
    navigate(ROUTERS.USER.POST_DETAIL.replace(':id', id));
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
    <div className="search__post__item" to={ROUTERS.USER.POST_DETAIL.replace(':id', id)}>
      <div className="post__content" onClick={handleNavigateToPostDetail}>
        <img className="image__item" src={`${IMAGE_URL}${imageUrl}`} alt={title || 'Hình ảnh'} />
        <div className="post__details">
          <p className="post__title">{getTitle(type, title)}</p>
          <p className="post__price">{maxRent && minRent ? `${getPrice(minRent, maxRent)} VNĐ` : 'Không có giá'}</p>
          <p className="post__area">{maxArea && minArea ? `${getArea(minArea, maxArea)} m²` : 'Không có diện tích'}</p>
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
        {
          !showMenu && (
            <div className="container__favorite">
              <CiHeart onClick={handleAddFavoritePost}/>
            </div>
          )
        }
        {showMenu && (
          <div className="menu__container" ref={menuRef}>
            <BsThreeDotsVertical
              className="menu__icon"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation(); // Ngăn click lan truyền
                setIsMenuOpen(!isMenuOpen);
              }}
            />
            {isMenuOpen && (
              <div className="menu__popup">
                <button
                  className="delete__button"
                  onClick={handleDelete}
                >
                  Xóa khỏi danh sách
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchPostItem;