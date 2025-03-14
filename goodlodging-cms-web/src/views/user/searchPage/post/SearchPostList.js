import React from 'react';
import './style.scss';
import SearchPostItem from './SearchPostItem';

const SearchPostList = ({ posts }) => {
  return (
    <div className="container__search__list__post">
      {posts.length === 0 ? (
        <div className="post__not__found">Không tìm thấy bài đăng</div>
      ) : (
        posts.map(post => <SearchPostItem key={post.id} post={post} />)
      )}
    </div>
  );
};

export default SearchPostList;