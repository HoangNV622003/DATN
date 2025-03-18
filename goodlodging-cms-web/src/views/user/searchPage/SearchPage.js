// src/pages/SearchPage.jsx
import React, { useState, useEffect, memo } from 'react';
import { useLocation } from 'react-router-dom';
import SearchBar from '../../../components/searchBar/SearchBar';
import Pagination from '../../../components/pagination/Pagination';
import { fetchAllPost, searchPost } from '../../../apis/posts/PostService';
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
    const { wardsId = [], selectedProvince, selectedDistricts = [], selectedWards = [] } =
        location.state || {};

    const [payload, setPayload] = useState({
        wardsId: wardsId || [],
        minRoomRent: 0,
        maxRoomRent: 100000000,
        minArea: 0,
        maxArea: 1000,
        minElectricityPrice: 0,
        maxElectricityPrice: 100000,
        minWaterPrice: 0,
        maxWaterPrice: 100000,
        features: "",
        descriptions: "",
    });

    const handlePageChange = (newPage) => {
        setPosts((prev) => ({ ...prev, number: newPage }));
    };

    const handleLoadPost = async (page, searchPayload) => {
        try {
            const response = await searchPost(page, searchPayload);
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
        console.log("payload: ",payload)
        handleLoadPost(posts.number, payload);
    }, [posts.number, payload]);

    // Callback để cập nhật payload từ SearchBar
    const handleSearch = (searchData) => {
        setPayload((prev) => ({
            ...prev,
            wardsId: searchData.wardsId,
        }));
    };

    // Callback để cập nhật payload từ ConfigView
    const handleConfigChange = (newConfig) => {
        setPayload((prev) => ({
            ...prev,
            ...newConfig,
        }));
    };

    return (
        <div className="search-page">
            <div className="container__search__bar">
                <SearchBar
                    initialProvince={selectedProvince}
                    initialDistricts={selectedDistricts}
                    initialWards={selectedWards}
                    onSearch={handleSearch}
                />
            </div>
            <div className="content-wrapper">
                <div className="search__list__post">
                    <SearchPostList posts={posts.content} />
                </div>
                <div className="config-view">
                    <ConfigView onConfigChange={handleConfigChange} />
                </div>
            </div>
            <div className="navigation__paging">
                <Pagination posts={posts} onPageChange={handlePageChange} />
            </div>
        </div>
    );
};

export default memo(SearchPage);