import React from 'react';
import "./style.scss"
import MyPostItem from './MyPostItem';
const MyPostList = ({ posts }) => {

    return (
        <div className="container__search__list__post">
            {posts.length === 0 ? (
                <div className="post__not__found">Không tìm thấy bài đăng</div>
            ) : (
                posts.map((post,index) => <MyPostItem key={post.id || index} post={post} />)
            )}
        </div>
    );
};

export default MyPostList;