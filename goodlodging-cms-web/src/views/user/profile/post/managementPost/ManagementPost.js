import React, { useEffect, useState } from 'react';
import "./style.scss";
import { fetchMyPosts } from '../../../../../apis/posts/PostService';
import { useAuth } from '../../../../../context/AuthContext';
import MyPostList from './myPost/MyPostList';
import { useNavigate } from 'react-router-dom';
import { ROUTERS } from '../../../../../utils/router/Router';
import { toast } from 'react-toastify';
const ManagementPost = () => {
    const navigate=useNavigate();
    const {user,isLogin,loading,token}=useAuth();
    const [myPosts,setMyPosts]=useState([]);
    const [error,setError]=useState(null);
    const [loadingData,setLoadingData]=useState(false);
    const handleLoadMyPosts=async (userId) => {
        try {
            setError(null);
            setLoadingData(true);
            const response=await fetchMyPosts(userId);
            setMyPosts(response.content);
        } catch (error) {
            setLoadingData(false)
            setError("Lỗi không thể tải bài viết, vui lòng thử lại sau")
        }finally{
            setLoadingData(false)
        }
    }
    useEffect(() => {
        // Chỉ chạy logic sau khi loading hoàn tất
        if (!loading) {
            if (!isLogin || !user) {
                toast.error("Vui lòng đăng nhập để truy cập trang này",{
                    autoClose: 3000, // Đóng sau 3 giây
                    onClose: () => navigate(ROUTERS.AUTH.LOGIN),  // Chuyển trang sau khi đóng
                });
                navigate(ROUTERS.AUTH.LOGIN);
            }
            else{
                handleLoadMyPosts(user.id);
            }
        }
    }, [isLogin, user, loading, navigate]);

    if (loadingData) {
        return <div className="loading">Đang tải...</div>;
    }
    return (
        <div className='container__my__post'>
            {
                myPosts.length===0 ? (
                    <div className="my-posts-header">
                        <h2>Không có bài viết nào</h2>
                        <p>Bạn chưa có bài viết nào. Hãy tạo một bài viết mới!</p>
                    </div>
                )
                : (
                    <div className="my-posts-header">
                        <h2>Danh sách bài viết</h2>
                    </div>
                )
            }
            <div className="error">{error}</div>
            <MyPostList 
                initialPosts={myPosts} 
                accessToken={token}
            />
        </div>
    );
};

export default ManagementPost;