// src/pages/SearchPage.jsx
import React, { useState, useEffect, memo } from 'react';
import { useLocation } from 'react-router-dom';
import SearchBar from '../../../components/searchBar/SearchBar';
import Pagination from '../../../components/pagination/Pagination';
import { fetchAllPost } from '../../../apis/posts/PostService';
import './style.scss';
import ConfigView from '../../../components/config/ConfigView';
import SearchPostList from './post/SearchPostList';

const SearchPage = () => {
    const [posts, setPosts] = useState({
        content: [],
        totalPages: 0,
        number: 0,
        first: true,
        last: true,
    });
    const location = useLocation();
    const { wardsId = [], selectedProvince, selectedDistricts = [], selectedWards = [] } = location.state || {};

    const handlePageChange = (newPage) => {
        setPosts((prev) => ({ ...prev, number: newPage }));
    };

    const handleLoadPost = async (page, wardsId) => {
        try {
            const response = await fetchAllPost(page, { wardsId });
            if (response && response.content) {
                setPosts({
                    content: response.content,
                    totalPages: response.totalPages,
                    number: response.number,
                    first: response.first,
                    last: response.last,
                });
            } else {
                console.error("Dữ liệu không hợp lệ:", response);
                setPosts({ content: [], totalPages: 0, number: 0, first: true, last: true });
            }
        } catch (error) {
            console.error("Lỗi khi tải bài viết:", error);
            setPosts({ content: [], totalPages: 0, number: 0, first: true, last: true });
        }
    };

    useEffect(() => {
        handleLoadPost(posts.number, wardsId);
    }, [posts.number, wardsId]);

    return (
        <div className="search-page">
            <div className="container__search__bar">
                <SearchBar
                    initialProvince={selectedProvince}
                    initialDistricts={selectedDistricts}
                    initialWards={selectedWards}/>
            </div>
            <h2>Kết quả tìm kiếm</h2>
            <div className="content-wrapper">
                <div className="search__list__post">
                    <SearchPostList posts={posts.content} />
                </div>
                <div className="config-view">
                    <ConfigView />
                </div>
            </div>
            <div className="navigation__paging">
                <Pagination posts={posts} onPageChange={handlePageChange} />
            </div>
        </div>
    );
};

export default memo(SearchPage);