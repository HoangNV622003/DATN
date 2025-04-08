// src/components/FavoritePost.jsx
import React, { useEffect, useState } from 'react';
import { useAuth } from '../../../context/AuthContext';
import { fetchFavoritePosts, deleteFavoritePost } from '../../../apis/favorite-posts/FavoritePostService';
import SearchPostList from '../searchPage/post/SearchPostList';
import './style.scss';

const FavoritePost = () => {
    const { user, isLogin,token } = useAuth();
    const [posts, setPosts] = useState([]);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);
  
    const handleLoadData = async (id) => {
      try {
        setLoading(true);
        const response = (await fetchFavoritePosts(id,token)).data;
        if (!Array.isArray(response)) {
          throw new Error("Dữ liệu không hợp lệ từ server");
        }
        setPosts(response);
      } catch (error) {
        console.error("ERROR: ", error);
        setError("Có lỗi khi hiển thị danh sách bài viết yêu thích");
      } finally {
        setLoading(false);
      }
    };
  
    const handlePostDeleted = (postId) => {
      setPosts(posts.filter(post => post.id !== postId));
    };
  
    useEffect(() => {
      if (user && isLogin) {
        handleLoadData(user.id);
      }
    }, [user?.id, isLogin]);
  
    if (!isLogin) {
      return <div className='require-login'>Vui lòng đăng nhập để xem bài viết yêu thích</div>;
    }
  
    if (loading) {
      return <div>Đang tải...</div>;
    }
  
    if (error) {
      return <div>{error}</div>;
    }
  
    return (
      <div className="container__favorite__post">
        <p className="title">Bài viết yêu thích</p>
        <SearchPostList
          posts={posts}
          showMenu={true}
          onPostDeleted={handlePostDeleted}
        />
      </div>
    );
  };
  
  export default FavoritePost;