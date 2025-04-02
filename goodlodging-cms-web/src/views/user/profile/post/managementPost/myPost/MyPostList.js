import React, { useState } from 'react';
import './style.scss';
import MyPostItem from './MyPostItem';

const MyPostList = ({ initialPosts }) => {
    const [posts, setPosts] = useState(initialPosts || []); // Quản lý state posts

    // Callback để cập nhật danh sách sau khi xóa
    const handleDeleteSuccess = (deletedPostId) => {
        setPosts(posts.filter((post) => post.id !== deletedPostId)); // Loại bỏ bài đăng đã xóa
    };

    return (
        <div className="container__search__list__post">
            {posts.length === 0 ? (
                <div className="post__not__found">Không tìm thấy bài đăng</div>
            ) : (
                posts.map((post, index) => (
                    <MyPostItem
                        key={post.id || index}
                        post={post}
                        onDeleteSuccess={handleDeleteSuccess} // Truyền callback
                    />
                ))
            )}
        </div>
    );
};

export default MyPostList;