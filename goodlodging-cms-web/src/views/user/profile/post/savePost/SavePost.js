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

const PostForm = ({ post, file, imagePreview, isEditMode, loadingData, onInputChange, onFileChange, onSubmit, onCancel }) => (
  <form onSubmit={onSubmit} className="save-post__form" data-testid="save-post__form">
    {isEditMode && (
      <div className="save-post__form-group">
        <label htmlFor="post-id">ID</label>
        <input
          id="post-id"
          type="text"
          value={post.id || ''}
          disabled
          aria-label="ID bài đăng"
        />
      </div>
    )}
    <div className="save-post__form-group">
      <label htmlFor="title">Tiêu đề</label>
      <input
        id="title"
        type="text"
        name="title"
        value={post.title}
        onChange={onInputChange}
        required
        aria-label="Tiêu đề bài đăng"
      />
    </div>
    <div className="save-post__form-group">
      <label htmlFor="imageUrl">Hình ảnh</label>
      <div className="save-post__image-section">
        {isEditMode && post.imageUrl && !imagePreview && (
          <div className="save-post__current-image">
            <img src={`${IMAGE_URL}${post.imageUrl}`} alt="Ảnh hiện tại" />
          </div>
        )}
        {imagePreview && (
          <div className="save-post__image-preview">
            <img src={imagePreview} alt="Ảnh xem trước" />
          </div>
        )}
        <input
          id="imageUrl"
          type="file"
          name="imageUrl"
          accept="image/jpeg,image/png,image/gif,image/webp"
          onChange={onFileChange}
          aria-label="Tải lên ảnh bài đăng"
        />
      </div>
    </div>
    <div className="save-post__form-group">
      <label htmlFor="area">Diện tích phòng (m²)</label>
      <input
        id="area"
        type="text"
        value={getArea(post.minArea, post.maxArea)}
        disabled
        aria-label="Phạm vi diện tích"
      />
    </div>
    <div className="save-post__form-group">
      <label htmlFor="roomRent">Tiền thuê (VNĐ)</label>
      <input
        id="roomRent"
        type="text"
        value={getPrice(post.minRent, post.maxRent)}
        disabled
        aria-label="Phạm vi tiền thuê"
      />
    </div>
    <div className="save-post__form-group">
      <label htmlFor="electricityPrice">Tiền điện (VNĐ)</label>
      <input
        id="electricityPrice"
        type="text"
        value={post.electricityPrice}
        disabled
        aria-label="Giá điện"
      />
    </div>
    <div className="save-post__form-group">
      <label htmlFor="waterPrice">Tiền nước (VNĐ)</label>
      <input
        id="waterPrice"
        type="text"
        value={post.waterPrice}
        disabled
        aria-label="Giá nước"
      />
    </div>
    <div className="save-post__form-group">
      <label htmlFor="otherPrice">Chi phí khác (VNĐ)</label>
      <input
        id="otherPrice"
        type="text"
        value={post.otherPrice}
        disabled
        aria-label="Chi phí khác"
      />
    </div>
    <div className="save-post__form-group">
      <label htmlFor="boardingHouseId">ID Nhà trọ</label>
      <input
        id="boardingHouseId"
        type="number"
        name="boardingHouseId"
        value={post.boardingHouseId}
        onChange={onInputChange}
        disabled
        aria-label="ID nhà trọ"
      />
    </div>
    <div className="save-post__form-buttons">
      <button
        type="submit"
        disabled={loadingData}
        aria-label={isEditMode ? 'Cập nhật bài đăng' : 'Tạo bài đăng mới'}
      >
        {loadingData ? 'Đang lưu...' : (isEditMode ? 'Cập nhật' : 'Tạo mới')}
      </button>
      <button
        type="button"
        className="save-post__cancel-btn"
        onClick={onCancel}
        disabled={loadingData}
        aria-label="Hủy"
      >
        Hủy
      </button>
    </div>
  </form>
);

const SavePost = () => {
  const { user, token, isLogin, loading } = useAuth();
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
  const [imagePreview, setImagePreview] = useState(null);
  const [loadingData, setLoadingData] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!loading) {
      if (!isLogin || !user) {
        toast.error('Vui lòng đăng nhập để tiếp tục');
        navigate(ROUTERS.AUTH.LOGIN);
      } else {
        handleFetchData();
      }
    }
  }, [postId, isEditMode, token, user, loading, navigate, isLogin]);

  useEffect(() => {
    return () => {
      if (imagePreview) {
        URL.revokeObjectURL(imagePreview);
      }
    };
  }, [imagePreview]);

  const handleFetchData = async () => {
    setLoadingData(true);
    try {
      if (isEditMode) {
        const data = await fetchMyPost(postId, token);
        setPost({
          id: data.postResponse.id || null,
          roomId: data.postResponse.roomId || '',
          type: data.postResponse.type || '',
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
      } else {
        const data = await fetchAllHouse(user.id, token);
        setPost({
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
          userId: user.id,
          boardingHouseId: '',
          boardingHouses: Array.isArray(data) ? data : [],
        });
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Không thể tải dữ liệu bài đăng');
      toast.error(err.response?.data?.message || 'Không thể tải dữ liệu bài đăng');
    } finally {
      setLoadingData(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setPost((prev) => ({
      ...prev,
      [name]: ['boardingHouseId'].includes(name) ? parseInt(value, 10) || '' : value,
    }));
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (!selectedFile) return;

    const validImageTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
    if (!validImageTypes.includes(selectedFile.type)) {
      toast.warn('Vui lòng chọn ảnh định dạng JPEG, PNG, GIF hoặc WebP');
      return;
    }

    const maxFileSize = 5 * 1024 * 1024; // 5MB
    if (selectedFile.size > maxFileSize) {
      toast.warn('Ảnh quá lớn, vui lòng chọn ảnh dưới 5MB');
      return;
    }

    if (imagePreview) {
      URL.revokeObjectURL(imagePreview);
    }

    setFile(selectedFile);
    setImagePreview(URL.createObjectURL(selectedFile));
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
    setLoadingData(true);
    setError(null);

    if (!post.title.trim()) {
      setError('Vui lòng nhập tiêu đề');
      toast.warn('Vui lòng nhập tiêu đề');
      setLoadingData(false);
      return;
    }

    if (!isEditMode && !file) {
      setError('Vui lòng chọn một ảnh');
      toast.warn('Vui lòng chọn một ảnh');
      setLoadingData(false);
      return;
    }

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
      await (isEditMode ? updatePost(postId, formData, token) : createPost(formData, token));
      toast.success(`${isEditMode ? 'Cập nhật' : 'Tạo mới'} bài viết thành công`, {
        autoClose: 2000,
        onClose: () => {
          navigate(`${ROUTERS.USER.PROFILE.replace('*', '')}${ROUTERS.USER.POST.MANAGEMENT}`);
        },
      });
    } catch (err) {
      setError(err.response?.data?.message || 'Lưu bài viết thất bại, vui lòng thử lại');
      toast.error(err.response?.data?.message || 'Lưu bài viết thất bại, vui lòng thử lại');
    } finally {
      setLoadingData(false);
    }
  };

  const handleCancel = () => {
    navigate(`${ROUTERS.USER.PROFILE.replace('*', '')}${ROUTERS.USER.POST.MANAGEMENT}`);
  };

  if (loadingData) {
    return <div className="save-post__loading">Đang tải...</div>;
  }

  return (
    <div className="save-post" data-testid="save-post">
      <h2>{isEditMode ? 'Chỉnh sửa bài viết' : 'Tạo bài viết'}</h2>
      {error && <div className="save-post__error">{error}</div>}
      <PostForm
        post={post}
        file={file}
        imagePreview={imagePreview}
        isEditMode={isEditMode}
        loadingData={loadingData}
        onInputChange={handleInputChange}
        onFileChange={handleFileChange}
        onSubmit={handleSubmit}
        onCancel={handleCancel}
      />
      {post.type !== 2 && (
        <div className="save-post__house-list">
          <ListBoardingHouse
            boardingHouses={post.boardingHouses}
            onSelect={handleBoardingHouseSelect}
            selectedId={post.boardingHouseId}
            isSavePost={true}
          />
        </div>
      )}
    </div>
  );
};

export default SavePost;