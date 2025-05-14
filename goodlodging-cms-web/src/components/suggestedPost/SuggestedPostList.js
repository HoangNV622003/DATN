import React, { useState, useEffect, useMemo } from 'react';
import { FaHeart, FaRegHeart, FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import './SuggestedPostList.scss';
import { IMAGE_URL } from '../../utils/ApiUrl';
import { toast } from 'react-toastify';
import { createFavoritePost } from '../../apis/favorite-posts/FavoritePostService';
import { useAuth } from '../../context/AuthContext';

const SuggestedPostList = ({ posts }) => {
  const { user } = useAuth();
  const [startIndex, setStartIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(true);

  // Preload images to avoid lag
  useEffect(() => {
    const preloadImages = () => {
      posts.forEach((post) => {
        const img = new Image();
        img.src = IMAGE_URL + post.imageUrl;
      });
    };
    preloadImages();
  }, [posts]);

  // Auto-shift every 2 seconds
  useEffect(() => {
    if (posts.length <= 3) return;

    const interval = setInterval(() => {
      setStartIndex((prevIndex) => (prevIndex + 1) % posts.length);
    }, 3000);

    return () => clearInterval(interval);
  }, [posts.length]);

  const toggleFavorite = (postId) => {
    if (user === null) {
      toast.info("Vui lòng đăng nhập để thực hiện tính năng này");
    } else {
      const payload = { userId: user.id, postId: postId };
      createFavoritePost(payload)
        .then((response) => {
          toast.success(response.data.result || response.data.message);
        })
        .catch((error) => {
          toast.error(error.message || "Có lỗi xảy ra, vui lòng thử lại sau");
        });
    }
  };

  // Handle previous button click
  const handlePrev = () => {
    setStartIndex((prevIndex) => (prevIndex - 1 + posts.length) % posts.length);
  };

  // Handle next button click
  const handleNext = () => {
    setStartIndex((prevIndex) => (prevIndex + 1) % posts.length);
  };

  // Memoize posts and create circular list
  const circularPosts = useMemo(() => {
    if (posts.length <= 3) return posts;
    return [...posts, ...posts, ...posts]; // Replicate the list 3 times for smooth circular effect
  }, [posts]);

  return (
    <div className="suggested-post">
      {posts.length > 0 ? (
        <div className="post-list-wrapper">
          <button
            className="nav-button prev-button"
            onClick={handlePrev}
            disabled={posts.length <= 3}
            aria-label="Bài viết trước"
          >
            <FaChevronLeft />
          </button>
          <div className="post-list-container">
            <div
              className={`post-list ${!isTransitioning ? 'no-transition' : ''}`}
              style={{
                transform: `translateX(-${startIndex * (300 + 16)}px)`,
                transition: 'transform 0.3s ease-in-out',
              }}
            >
              {circularPosts.map((post, index) => (
                <div key={`${post.id}-${index}`} className="post-card">
                  <div className="post-image">
                    <img
                      src={IMAGE_URL + post.imageUrl}
                      alt={post.title}
                      onError={(e) => {
                        e.target.src = 'https://via.placeholder.com/150';
                      }}
                    />
                  </div>
                  <div className="post-details">
                    <h3>{post.title}</h3>
                    <p className="price">
                      Giá: {post.minRent.toLocaleString('vi-VN')} -{' '}
                      {post.maxRent.toLocaleString('vi-VN')} VNĐ
                    </p>
                    <p className="area">
                      Diện tích: {post.minArea} - {post.maxArea} m²
                    </p>
                    <p className="address">Địa chỉ: {post.address}</p>
                  </div>
                  <button
                    className="favorite-icon"
                    onClick={() => toggleFavorite(post.id)}
                  >
                    <FaRegHeart />
                  </button>
                </div>
              ))}
            </div>
          </div>
          <button
            className="nav-button next-button"
            onClick={handleNext}
            disabled={posts.length <= 3}
            aria-label="Bài viết tiếp theo"
          >
            <FaChevronRight />
          </button>
        </div>
      ) : (
        <p className="no-posts">Không có phòng trọ nào để hiển thị.</p>
      )}
    </div>
  );
};

export default SuggestedPostList;
