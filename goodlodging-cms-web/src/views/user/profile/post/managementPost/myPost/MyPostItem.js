import React, { useState } from 'react';
import './style.scss';
import { formatCurrency, formatDate } from '../../../../../../utils/formatter/FormatUtils';
import { IMAGE_URL } from '../../../../../../utils/ApiUrl';
import { useNavigate } from 'react-router-dom';
import { ROUTERS } from '../../../../../../utils/router/Router';
import { deletePost } from '../../../../../../apis/posts/PostService';
import { toast } from 'react-toastify';

const MyPostItem = ({ post, onDeleteSuccess,accessToken }) => {
    const navigate = useNavigate();
    const [error, setError] = useState(null);
    const [showConfirmModal, setShowConfirmModal] = useState(false); // State để hiển thị modal

    const handleNavigateToDetailMyPost = () => {
        navigate(ROUTERS.USER.PROFILE.replace("*", "") + ROUTERS.USER.POST.UPDATE.replace(":postId", post.id));
    };

    const handleDeleteMyPost = (e) => {
        e.stopPropagation(); // Ngăn sự kiện click lan lên div.post-item
        setShowConfirmModal(true); // Hiển thị modal xác nhận
    };

    const confirmDelete = async () => {
        setShowConfirmModal(false); // Ẩn modal
        try {
            await deletePost([post.id],accessToken); // Gọi API xóa bài đăng
            toast.success('Xóa bài đăng thành công');
            if (onDeleteSuccess) onDeleteSuccess(post.id); // Gọi callback để cập nhật danh sách
        } catch (error) {
            setError('Lỗi khi xóa bài đăng, vui lòng thử lại sau');
            toast.error('Xóa bài đăng thất bại, vui lòng thử lại');
        }
    };

    const cancelDelete = () => {
        setShowConfirmModal(false); // Ẩn modal khi hủy
    };

    return (
        <div className="post-item">
            <div className="post-content" onClick={handleNavigateToDetailMyPost}>
                <div className="post-image">
                    <img
                        src={IMAGE_URL + post.imageUrl}
                        alt={post.title}
                        onError={(e) => (e.target.src = 'path/to/fallback-image.jpg')}
                    />
                </div>
                <div className="post-details">
                    <h3 className="post-title">{post.title}</h3>
                    <p className="post-address">
                        <strong>Địa chỉ:</strong> {post.address}
                    </p>
                    <p className="post-area">
                        <strong>Diện tích:</strong> {post.minArea + ' - ' + post.maxArea} m²
                    </p>
                    <p className="post-price">
                        <strong>Giá thuê:</strong> {formatCurrency(post.minRent) + ' - ' + formatCurrency(post.maxRent)}
                    </p>
                    <p className="post-modified">
                        <strong>Cập nhật:</strong> {formatDate(post.modifiedDate)}
                    </p>
                </div>
            </div>
            {error && <div className="error">{error}</div>}
            <button className="btn-delete" onClick={handleDeleteMyPost}>
                Xóa
            </button>
            {/* Modal xác nhận */}
            {showConfirmModal && (
                <div className="confirm-modal-overlay">
                    <div className="confirm-modal">
                        <h3>Xác nhận xóa</h3>
                        <p>
                            Bạn có chắc chắn muốn xóa bài đăng "<strong>{post.title}</strong>" không?
                        </p>
                        <div className="confirm-modal-buttons">
                            <button className="btn-confirm" onClick={confirmDelete}>
                                Xác nhận
                            </button>
                            <button className="btn-cancel" onClick={cancelDelete}>
                                Hủy
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default MyPostItem;