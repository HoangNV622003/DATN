import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ROUTERS } from '../../../../../utils/router/Router';
import './style.scss';
import { useAuth } from '../../../../../context/AuthContext';
import { createPost, updatePost, fetchMyPost } from '../../../../../apis/posts/PostService';
import { IMAGE_URL } from '../../../../../utils/ApiUrl';
import ListBoardingHouse from '../../boardingHouse/listBoardingHouse/ListBoardingHouse';
import { fetchMyBoardingHouse } from '../../../../../apis/account/UserService';
import { fetchAllHouse } from '../../../../../apis/house/BoardingHouseService';

const SavePost = () => {
    const { user, token } = useAuth();
    const { postId } = useParams();
    const navigate = useNavigate();
    const isEditMode = !!postId;

    const [post, setPost] = useState({
        id: null,
        title: '',
        imageUrl: '',
        area: '',
        roomRent: '',
        userId: '',
        boardingHouseId: '',
        address: '',
        boardingHouses: [],
    });
    const [file, setFile] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (isEditMode) {
            setLoading(true);
            fetchMyPost(postId)
                .then((data) => {
                    setPost({
                        id: data.postResponse.id,
                        title: data.postResponse.title || '',
                        imageUrl: data.postResponse.imageUrl || '',
                        area: data.postResponse.area || '',
                        roomRent: data.postResponse.roomRent || '',
                        userId: data.postResponse.userId || '',
                        boardingHouseId: data.postResponse.boardingHouseId || '',
                        address: data.postResponse.address || '',
                        boardingHouses: Array.isArray(data.boardingHouses) ? data.boardingHouses : [],
                    });
                    setLoading(false);
                })
                .catch((err) => {
                    setError('Không thể tải dữ liệu bài đăng');
                    setLoading(false);
                });
        }else{
            setLoading(true);
            fetchAllHouse(user.id,token)
                .then((data) => {
                    setPost({
                        id: '',
                        title: '',
                        imageUrl: '',
                        area:  '',
                        roomRent:  '',
                        userId: '',
                        boardingHouseId: '',
                        address: '',
                        boardingHouses: Array.isArray(data) ? data : [],
                    });
                    setLoading(false);
                })
                .catch((err) => {
                    setError('Không thể tải dữ liệu bài đăng');
                    setLoading(false);
                });
        }
    }, [postId, isEditMode, token]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setPost((prev) => ({
            ...prev,
            [name]:
                name === 'area' || name === 'roomRent' || name === 'boardingHouseId'
                    ? parseFloat(value) || ''
                    : value,
        }));
    };

    const handleFileChange = (e) => {
        setFile(e.target.files[0]);
    };

    const handleBoardingHouseSelect = (boardingHouse) => {
        setPost((prev) => ({
            ...prev,
            boardingHouseId: boardingHouse.id,
            roomRent: boardingHouse.roomRent || '',
            area: boardingHouse.roomArea || boardingHouse.area || '',
            address: boardingHouse.address || '', // Cập nhật địa chỉ từ BoardingHouse
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        const formData = new FormData();
        formData.append('title', post.title);
        formData.append('area', post.area);
        formData.append('roomRent', post.roomRent);
        formData.append('userId', user.id);
        formData.append('boardingHouseId', post.boardingHouseId);
        formData.append('address', post.address);
        if (isEditMode) formData.append('id', post.id);
        if (file) formData.append('imageUrl', file);

        try {
            await (isEditMode
                ? updatePost(postId, formData, token)
                : createPost(formData, token));
            navigate(`${ROUTERS.USER.PROFILE.replace('*', '')}${ROUTERS.USER.POST.MANAGEMENT}`);
        } catch (err) {
            setError(err.message || 'Lưu bài đăng thất bại, vui lòng thử lại');
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
                    <label htmlFor="address">Địa chỉ</label>
                    <input
                        type="text"
                        id="address"
                        name="address"
                        value={post.address}
                        onChange={handleInputChange}
                        disabled                        
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
                        type="number"
                        id="area"
                        name="area"
                        value={post.area}
                        onChange={handleInputChange}
                        step="0.1"
                        min="0"
                        disabled
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="roomRent">Tiền thuê (VNĐ)</label>
                    <input
                        type="number"
                        id="roomRent"
                        name="roomRent"
                        value={post.roomRent}
                        onChange={handleInputChange}
                        min="0"
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
                <div className="container__house__list">
                    <ListBoardingHouse
                        boardingHouses={post.boardingHouses}
                        onSelect={handleBoardingHouseSelect}
                        selectedId={post.boardingHouseId}
                        isSavePost={true}
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
            </form>
        </div>
    );
};

export default SavePost;