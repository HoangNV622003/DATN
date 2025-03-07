import React from 'react';
import PostItem from './PostItem';
import "./style.scss";
import { memo } from 'react';
const ListPost = ({ posts }) => {
    console.log("post: ",posts)
    return (
        <div className='container__list__post'>
            {posts && posts.length > 0 ? (
                posts.map((item, index) => (
                    <PostItem 
                        key={item.id || index} // Ưu tiên dùng id nếu có
                        post={item}
                    />
                ))
            ) : (
                <p>Không có bài viết nào để hiển thị</p>
            )}
        </div>
    );
};

export default memo(ListPost);
