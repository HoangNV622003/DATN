import React, { useEffect, useState } from 'react';
import { AiOutlineMail } from 'react-icons/ai';
import { FiPhoneCall } from 'react-icons/fi';
import AuthorInformation from '../../../components/authorInformation/AuthorInformation';
import { useParams } from 'react-router-dom';
import SearchPostList from '../searchPage/post/SearchPostList';
import { fetchAuthorInformation as fetchAuthorInfo } from '../../../apis/posts/PostService';
import "./style.scss";
import Pagination from '../../../components/pagination/Pagination';

const AuthorPosts = () => {
    const { id } = useParams();
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);
    const [currentPage, setCurrentPage] = useState(0); // Thêm state cho trang hiện tại
    const [author, setAuthor] = useState({
        authorInfo: {
            id: null,
            imageUrl: '',
            fullName: '',
            email: '',
            phoneNumber: ''
        },
        posts: {
            content: [],
            totalPages: 0,
            number: 0,
            first: true,
            last: true,
            totalElements: 0
        }
    });

    const fetchAuthorInformation = async (id, page = 0) => {
        try {
            setLoading(true);
            const response = await fetchAuthorInfo(id, page); // Giả sử API hỗ trợ tham số page
            setAuthor({
                authorInfo: {
                    id: response.authorInfo.id || null,
                    imageUrl: response.authorInfo.imageUrl || '',
                    fullName: `${response.authorInfo.firstName} ${response.authorInfo.lastName}`,
                    email: response.authorInfo.email || '',
                    phoneNumber: response.authorInfo.phone || ''
                },
                posts: response.posts || { content: [], totalPages: 0, number: 0, first: true, last: true }
            });
            setCurrentPage(page); // Cập nhật trang hiện tại
        } catch (error) {
            console.log("Error: ", error);
            setError("Có lỗi khi lấy thông tin tác giả, vui lòng thử lại sau");
        } finally {
            setLoading(false);
        }
    };

    const handlePageChange = (newPage) => {
        fetchAuthorInformation(id, newPage); // Gọi API với trang mới
    };

    useEffect(() => {
        fetchAuthorInformation(id, currentPage);
    }, [id]); // Chỉ phụ thuộc vào id, không cần currentPage ở đây vì handlePageChange sẽ xử lý

    if (loading) {
        return <div>Đang tải...</div>;
    }

    if (error) {
        return <div>{error}</div>;
    }

    return (
        <div className='container__author'>
            <img
                style={{ height: "200px", width: "100%", objectFit: 'cover' }}
                src="https://file.canho.com.vn/8/seller_bg_ade1e47731.jpg"
                alt=""
            />
            <div className='container__author__post'>
                <div className="posts__info">
                    <SearchPostList posts={author.posts.content} /> {/* Chỉ truyền content */}
                </div>
                <div className="author__info">
                    <AuthorInformation data={author.authorInfo} isNavigate={false}/>
                </div>
            </div>
            <div className="navigation__paging">
                <Pagination posts={author.posts} onPageChange={handlePageChange} /> {/* Truyền toàn bộ posts */}
            </div>
        </div>
    );
};

export default AuthorPosts;