import React, { useEffect, useState } from 'react';
import "./style.scss";
import { useParams } from 'react-router-dom';
import { getPost } from '../../apis/posts/PostService';
const PostDetail = () => {
    const {id}=useParams();
    const [postDetail,setPostDetail]=useState();
    const [error,setError]=useState('');
    const [loading,setLoading]=useState(true);
    const handleLoadData=async()=>{
        try {
            setError('');
            const postDetail=await getPost(id);
            setPostDetail(postDetail);
            setLoading(false);
        } catch (error) {
            setError("Có lỗi khi lấy dữ liệu, vui lòng thử lại sau")
            setPostDetail(null);
            console.log("ERROR",error);
        }
        
    }
    useEffect(()=>{
        handleLoadData();
    },[])
    return (
        <div className='container__post__detail'>
            <p>{error}</p>
            <div className="container__image">

            </div>
            <div className="container__author__information">

            </div>
            <div className="container__post__information">

            </div>
            <div className="container__suggestion__post">

            </div>
        </div>
    );
};

export default PostDetail;