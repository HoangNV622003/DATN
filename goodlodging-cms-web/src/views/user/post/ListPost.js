// src/pages/post/ListPost.jsx
import React from 'react';
import PostItem from './PostItem';
import "./style.scss";
import { memo } from 'react';

const ListPost = ({ posts }) => {
  console.log("Posts rendered:", posts); // Debug dữ liệu
  return (
    <div className="container__list__post">
      {posts && posts.length > 0 ? (
        posts.map((item, index) => (
          <PostItem 
            key={item.id || index}
            post={item}
          />
        ))
      ) : (
        <p className="post__not__found">Không có bài viết nào để hiển thị</p>
      )}
    </div>
  );
};

export default memo(ListPost);