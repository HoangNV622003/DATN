import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { memo } from 'react';
import SearchBar from '../../../components/searchBar/SearchBar';
import { fetchAllPost } from '../../../apis/posts/PostService';
import ListPost from "../../post/ListPost";
import "./style.scss";
const HomePage = () => {
    const [posts, setPosts] = useState([]);
    const [page, setPage] = useState(0);
    const navigate = useNavigate();

    const handleLoadPost = async () => {
        try {
            const result = await fetchAllPost(page);
            const response=result.content;
            if (response && Array.isArray(response)) {
                setPosts(response);
            } else {
                console.error("Dữ liệu không hợp lệ:", response);
                setPosts([]); // Set về mảng rỗng để tránh lỗi render
            }
        } catch (error) {
            console.error("Lỗi khi tải bài viết:", error);
            setPosts([]);
        }
    };

    useEffect(() => {
        handleLoadPost();
    }, []); // Load lại dữ liệu khi page thay đổi

    return (
        <div className='container__home'>
            <div className="container__search__bar">
                <SearchBar />
            </div>
            <div className="list__post">
                <ListPost posts={posts} />
            </div>
        </div>
    );
};

export default memo(HomePage);
