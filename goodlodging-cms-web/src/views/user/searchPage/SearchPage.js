import React, { useState, useEffect, memo } from 'react';
import { useLocation } from 'react-router-dom';
import SearchBar from '../../../components/searchBar/SearchBar';
import Pagination from '../../../components/pagination/Pagination';
import { fetchAllPost, searchPost } from '../../../apis/posts/PostService';
import './style.scss';
import ConfigView from '../../../components/config/ConfigView';
import SearchPostList from './post/SearchPostList';
import { getValuesExcludingId, postTypeConstants } from '../../../constants/PostTypeConstants';
import { toast } from 'react-toastify';

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
        minRent: 0,
        maxRent: 100000000,
        minArea: 0,
        maxArea: 1000,
        minElectricityPrice: 0,
        maxElectricityPrice: 100000,
        minWaterPrice: 0,
        maxWaterPrice: 100000,
        features: "",
        description: "", // Sửa từ "descriptions" thành "description"
        roomType: getValuesExcludingId(1, postTypeConstants), // [1, 2]
    });

    const validatePayload = (payload) => {
        if (payload.minRent > payload.maxRent) {
            console.error("minRent phải nhỏ hơn hoặc bằng maxRent");
            return false;
        }
        if (payload.minArea > payload.maxArea) {
            console.error("minArea phải nhỏ hơn hoặc bằng maxArea");
            return false;
        }
        if (payload.minElectricityPrice > payload.maxElectricityPrice) {
            console.error("minElectricityPrice phải nhỏ hơn hoặc bằng maxElectricityPrice");
            return false;
        }
        if (payload.minWaterPrice > payload.maxWaterPrice) {
            console.error("minWaterPrice phải nhỏ hơn hoặc bằng maxWaterPrice");
            return false;
        }
        if (!Array.isArray(payload.roomType)) {
            console.error("roomType phải là một mảng");
            return false;
        }
        return true;
    };

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
            toast.error("Có lỗi xảy ra khi tải bài viết");
            setPosts({ content: [], totalPages: 0, number: 0, first: true, last: true });
        }
    };

    useEffect(() => {
        if (validatePayload(payload)) {
            console.log("payload: ", payload);
            handleLoadPost(posts.number, payload);
        }
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