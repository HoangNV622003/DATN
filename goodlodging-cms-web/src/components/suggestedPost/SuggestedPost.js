import React, { useState, useEffect } from 'react';
import axios from 'axios';
import SuggestedPostList from './SuggestedPostList';
import { fetchSuggestedPost } from '../../apis/posts/PostService';
import './SuggestedPost.scss';
const SuggestedPost = () => {
    const [address, setAddress] = useState({
        province: '',
        district: '',
        ward: ''
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [posts, setPosts] = useState([]);

    // Tự động lấy vị trí khi component mount
    useEffect(() => {
        getCurrentLocation();
    }, []);

    const getCurrentLocation = () => {
        setError('');
        setLoading(true);
        setAddress({ province: '', district: '', ward: '' });

        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const lat = position.coords.latitude;
                    const lng = position.coords.longitude;
                    reverseGeocode(lat, lng);
                },
                (err) => {
                    setLoading(false);
                    setError(`Lỗi lấy vị trí: ${err.message}`);
                    console.error(err.message);
                },
                { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
            );
        } else {
            setLoading(false);
            setError('Trình duyệt không hỗ trợ Geolocation');
            console.error('Trình duyệt không hỗ trợ Geolocation');
        }
    };

    const reverseGeocode = async (lat, lng) => {
        const url = `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json&addressdetails=1`;

        try {
            const response = await axios.get(url, {
                headers: {
                    'User-Agent': 'GoodLodgingService/1.0 (your.email@example.com)' // Thay bằng email hoặc tên ứng dụng
                }
            });
            const data = response.data;

            if (data && data.address) {
                const newAddress = {
                    province: data.address.city,
                    district: data.address.suburb,
                    ward: data.address.quarter
                };
                setAddress(newAddress);
                if (newAddress.province && newAddress.province !== 'Không tìm thấy') {
                    fetchPosts(newAddress); // Gọi fetchSuggestedPost nếu địa chỉ hợp lệ
                } else {
                    setError('Địa chỉ không hợp lệ');
                    console.error('Địa chỉ không hợp lệ');
                }
            } else {
                setError('Không tìm thấy địa chỉ');
                console.error('Không tìm thấy địa chỉ');
            }
        } catch (err) {
            setError(`Lỗi khi gọi Nominatim API: ${err.message}`);
            console.error(`Lỗi khi gọi Nominatim API: ${err.message}`);
        } finally {
            setLoading(false);
        }
    };

    const fetchPosts = async (address) => {
        setLoading(true);
        try {
            const payload = {
                provinceName: address.province,
                districtName: address.district || '',
                wardName: address.ward || ''
            };
            const response = await fetchSuggestedPost(payload);
            if (response && response.data) {
                setPosts(response.data);
            } else {
                console.error("Dữ liệu không hợp lệ:", response);
                setPosts([]);
            }
        } catch (error) {
            console.error("Lỗi khi tải bài viết:", error);
            setPosts([]);
            setError('Lỗi khi tìm kiếm nhà trọ: ' + error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className='suggested-post-container'>
            <p>Gợi ý dành cho bạn</p>
            <SuggestedPostList posts={posts} />
        </div>
    );
};

export default SuggestedPost;