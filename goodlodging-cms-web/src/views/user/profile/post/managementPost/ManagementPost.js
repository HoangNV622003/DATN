import React, { useEffect, useState } from 'react';
import "./style.scss";
import { fetchMyPosts } from '../../../../../apis/posts/PostService';
import { useAuth } from '../../../../../context/AuthContext';
import MyPostList from './myPost/MyPostList';
const ManagementPost = () => {
    //const {user}=useAuth();
    const [myPosts,setMyPosts]=useState([]);
    const [error,setError]=useState(null);
    const [loading,setLoading]=useState(false);
    const handleLoadMyPosts=async (userId) => {
        try {
            setError(null);
            setLoading(true);
            const response=await fetchMyPosts(userId);
            setMyPosts(response.content);
        } catch (error) {
            setLoading(false)
            setError("Lỗi không thể tải bài viết, vui lòng thử lại sau")
        }finally{
            setLoading(false)
        }
    }
    useEffect(()=>{
        handleLoadMyPosts(1);
    },[]);

    if (loading) {
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