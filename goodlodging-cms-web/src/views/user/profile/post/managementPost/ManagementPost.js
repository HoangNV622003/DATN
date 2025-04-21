import React, { useEffect, useState } from 'react';
import "./style.scss";
import { fetchMyPosts } from '../../../../../apis/posts/PostService';
import { useAuth } from '../../../../../context/AuthContext';
import MyPostList from './myPost/MyPostList';
import { useNavigate } from 'react-router-dom';
import { ROUTERS } from '../../../../../utils/router/Router';
const ManagementPost = () => {
    const navigate=useNavigate();
    const {user,isLogin,loading}=useAuth();
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
                alert("Vui lòng đăng nhập");
                navigate(`/${ROUTERS.AUTH.LOGIN}`);
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
            <div className="error">{error}</div>
            <MyPostList initialPosts={myPosts}/>
        </div>
    );
};

export default ManagementPost;