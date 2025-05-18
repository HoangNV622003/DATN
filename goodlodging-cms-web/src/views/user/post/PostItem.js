import React from 'react';
import './style.scss';
import { formatDate } from '../../../utils/DateTimeUtils';
import { useNavigate } from 'react-router-dom';
import { ROUTERS } from '../../../utils/router/Router';
import { CiHeart } from "react-icons/ci";
import { IMAGE_URL } from '../../../utils/ApiUrl';
import { toast } from 'react-toastify';
import { createFavoritePost } from '../../../apis/favorite-posts/FavoritePostService';
import { useAuth } from '../../../context/AuthContext';
import { getTile, getTitle } from '../../../utils/PostUtils';

const PostItem = ({ post }) => {
  const { user,token } = useAuth();
  const navigate = useNavigate();
  const handleNavigateToDetailPost = () => {
    navigate(ROUTERS.USER.POST_DETAIL.replace(':id', id))
  }
  const handleAddFavoritePost = () => {
    if (user === null||token===null) {
      toast.info("Vui lòng đăng nhập để thực hiện tính năng này")
    } else {

      const payload = {
        userId: user.id,
        postId: id,
      };
      createFavoritePost(payload,token)
        .then((response) => { toast.success(response.data.result || response.data.message) })
        .catch((error) => { toast.error(error || "Có lỗi sảy ra, vui lòng thử lại sau") });
    }
  }
  const getPrice = (minPrice, maxPrice) => {
    return minPrice === maxPrice ? minPrice : minPrice + ' - ' + maxPrice;
  }
  const getArea = (minArea, maxArea) => {
    return minArea === maxArea ? minArea : minArea + ' - ' + maxArea;

  }
  const { id,type, title, imageUrl, maxArea, minArea, maxRent, minRent, address, modifiedDate } = post;
  return (
    <div className="post__item">
      <div className="post__content" onClick={handleNavigateToDetailPost}>
        <img className="image__item" src={IMAGE_URL + imageUrl} alt={title || 'Hình ảnh'} />
        <div className="post__details">
          <p className="post__title">{getTitle(type,title)}</p>
          <p className="post__price">{maxRent && minRent ? `${getPrice(minRent, maxRent)} VNĐ` : 'Không có giá'}</p>
          <p className="post__area">{maxArea && minArea ? `${getArea(minArea, maxArea)} m²` : 'Không có diện tích'}</p>
          <p className="post__address">{address || 'Không có địa chỉ'}</p>
        </div>
      </div>
      <div className="container__favorite">
        <p className="post__date">{formatDate(modifiedDate) || 'Không có ngày'}</p>
        <CiHeart onClick={handleAddFavoritePost} />
      </div>
    </div>
  );
};

export default PostItem;