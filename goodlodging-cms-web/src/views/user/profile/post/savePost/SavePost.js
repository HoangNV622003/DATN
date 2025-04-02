import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ROUTERS } from '../../../../../utils/router/Router';
import './style.scss';
import { useAuth } from '../../../../../context/AuthContext';
import { createPost, updatePost, fetchMyPost } from '../../../../../apis/posts/PostService';
import { IMAGE_URL } from '../../../../../utils/ApiUrl';
import ListBoardingHouse from '../../boardingHouse/listBoardingHouse/ListBoardingHouse';
import { fetchAllHouse } from '../../../../../apis/house/BoardingHouseService';
import { getArea, getPrice } from '../../../../../utils/BoardingHouseConfig';
import { toast } from 'react-toastify';

const SavePost = () => {
    const { user, token } = useAuth();
    const { postId } = useParams();
    const navigate = useNavigate();
    const isEditMode = !!postId;

    const [post, setPost] = useState({
        id: null,
        title: '',
        imageUrl: '',
        minArea: '',
        maxArea: '',
        minRent: '',
        maxRent: '',
        electricityPrice: '',
        waterPrice: '',
        otherPrice: '',
        userId: '',
        boardingHouseId: '',
        boardingHouses: [],
    });
    const [file, setFile] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (!user || !user.id) {
            setError('Vui lòng đăng nhập để tiếp tục');
            setLoading(false);
            return;
        }
        if (isEditMode) {
            setLoading(true);
            fetchMyPost(postId)
                .then((data) => {
                    setPost({
                        id: data.postResponse.id,
                        title: data.postResponse.title || '',
                        imageUrl: data.postResponse.imageUrl || '',
                        minArea: data.postResponse.minArea || '',
                        maxArea: data.postResponse.maxArea || '',
                        minRent: data.postResponse.minRent || '',
                        maxRent: data.postResponse.maxRent || '',
                        electricityPrice: data.postResponse.electricityPrice || '',
                        waterPrice: data.postResponse.waterPrice || '',
                        otherPrice: data.postResponse.otherPrice || '',
                        userId: data.postResponse.userId || '',
                        boardingHouseId: data.postResponse.boardingHouseId || '',
                        boardingHouses: Array.isArray(data.boardingHouses) ? data.boardingHouses : [],
                    });
                    setLoading(false);
                })
                .catch((err) => {
                    setError('Không thể tải dữ liệu bài đăng');
                    setLoading(false);
                });
        } else {
            setLoading(true);
            fetchAllHouse(user.id, token)
                .then((data) => {
                    setPost({
                        id: '',
                        title: '',
                        imageUrl: '',
                        minArea: '',
                        maxArea: '',
                        minRent: '',
                        maxRent: '',
                        electricityPrice: '',
                        waterPrice: '',
                        otherPrice: '',
                        userId: '',
                        boardingHouseId: '',
                        boardingHouses: Array.isArray(data) ? data : [],
                    });
                    setLoading(false);
                })
                .catch((err) => {
                    setError('Không thể tải dữ liệu bài đăng');
                    setLoading(false);
                });
        }
    }, [postId, isEditMode, token, user]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setPost((prev) => ({
            ...prev,
            [name]: ['boardingHouseId'].includes(name) ? parseInt(value, 10) || '' : value,
        }));
    };

    const handleFileChange = (e) => {
        setFile(e.target.files[0]);
    };

    const handleBoardingHouseSelect = (boardingHouse) => {
        setPost((prev) => ({
            ...prev,
            boardingHouseId: boardingHouse.id,
            minRent: boardingHouse.minRent || '',
            maxRent: boardingHouse.maxRent || '',
            minArea: boardingHouse.minArea || '',
            maxArea: boardingHouse.maxArea || '',
            electricityPrice: boardingHouse.electricityPrice || '',
            waterPrice: boardingHouse.waterPrice || '',
            otherPrice: boardingHouse.otherPrice || '',
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        const formData = new FormData();
        formData.append('title', post.title);
        formData.append('minArea', post.minArea || '');
        formData.append('maxArea', post.maxArea || '');
        formData.append('minRent', post.minRent || '');
        formData.append('maxRent', post.maxRent || '');
        formData.append('electricityPrice', post.electricityPrice || '');
        formData.append('waterPrice', post.waterPrice || '');
        formData.append('otherPrice', post.otherPrice || '');
        formData.append('userId', user.id);
        formData.append('boardingHouseId', post.boardingHouseId || '');
        if (file) formData.append('imageUrl', file);

        try {
            await (isEditMode
                ? updatePost(postId, formData)
                : createPost(formData));
                toast.success(`${isEditMode ? 'Cập nhật' : 'Tạo mới'} bài viết thành công`, {
                    autoClose:2000,
                    onClose: () => {
                        navigate(`${ROUTERS.USER.PROFILE.replace('*', '')}${ROUTERS.USER.POST.MANAGEMENT}`);
                    },
                });        } catch (err) {
            setError('Lưu bài viết thất bại, vui lòng thử lại');
            toast.error('Lưu bài viết thất bại, vui lòng thử lại');
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return <div className="loading">Đang tải...</div>;
    }

    return (
        <div className="save-post-container">
            <h2>{isEditMode ? 'Chỉnh sửa bài đăng' : 'Tạo mới bài đăng'}</h2>
            {error && <div className="error">{error}</div>}
            <form onSubmit={handleSubmit}>
                {isEditMode && (
                    <div className="form-group">
                        <label>ID</label>
                        <input type="text" value={post.id || ''} disabled />
                    </div>
                )}
                <div className="form-group">
                    <label htmlFor="title">Tiêu đề</label>
                    <input
                        type="text"
                        id="title"
                        name="title"
                        value={post.title}
                        onChange={handleInputChange}
                        required
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="imageUrl">Hình ảnh</label>
                    {isEditMode && post.imageUrl && (
                        <div className="current-image">
                            <img src={IMAGE_URL + post.imageUrl} alt="Current" />
                        </div>
                    )}
                    <input
                        type="file"
                        id="imageUrl"
                        name="imageUrl"
                        accept="image/*"
                        onChange={handleFileChange}
                    />
                </div>
                
                <div className="form-group">
                    <label htmlFor="area">Diện tích phòng (m²)</label>
                    <input
                        type="text"
                        id="area"
                        value={getArea(post.minArea, post.maxArea)}
                        disabled
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="roomRent">Tiền thuê (VNĐ)</label>
                    <input
                        type="text"
                        id="roomRent"
                        value={getPrice(post.minRent, post.maxRent)}
                        disabled
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="electricityPrice">Tiền điện (VNĐ)</label>
                    <input
                        type="text"
                        id="electricityPrice"
                        value={post.electricityPrice}
                        disabled
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="waterPrice">Tiền nước (VNĐ)</label>
                    <input
                        type="text"
                        id="waterPrice"
                        value={post.waterPrice}
                        disabled
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="otherPrice">Chi phí khác (VNĐ)</label>
                    <input
                        type="text"
                        id="otherPrice"
                        value={post.otherPrice}
                        disabled
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="boardingHouseId">ID Nhà trọ</label>
                    <input
                        type="number"
                        id="boardingHouseId"
                        name="boardingHouseId"
                        value={post.boardingHouseId}
                        onChange={handleInputChange}
                        disabled
                    />
                </div>
                <div className="form-buttons">
                    <button type="submit" disabled={loading}>
                        {loading ? 'Đang lưu...' : (isEditMode ? 'Cập nhật' : 'Tạo mới')}
                    </button>
                    <button
                        type="button"
                        className="cancel"
                        onClick={() => navigate(`${ROUTERS.USER.PROFILE.replace('/*', '')}${ROUTERS.USER.POST.MANAGEMENT}`)}
                        disabled={loading}
                    >
                        Hủy
                    </button>
                </div>
                <div className="container__house__list">
                    <ListBoardingHouse
                        boardingHouses={post.boardingHouses}
                        onSelect={handleBoardingHouseSelect}
                        selectedId={post.boardingHouseId}
                        isSavePost={true}
                    />
                </div>
                
            </form>
        </div>
    );
};

export default SavePost;