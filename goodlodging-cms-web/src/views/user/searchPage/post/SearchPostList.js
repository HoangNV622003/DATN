import React from 'react';
import './style.scss';
import SearchPostItem from './SearchPostItem';

const SearchPostList = ({ posts, showMenu = false, onPostDeleted }) => {
  return (
    <div className="container__search__list__post">
      {posts.length === 0 ? (
        <div className="post__not__found">{showMenu?"":"Không tìm thấy bài viết"}</div>
      ) : (
        posts.map(post => (
          <SearchPostItem
            key={post.id}
            post={post}
            showMenu={showMenu}
            onPostDeleted={onPostDeleted}
          />
        ))
      )}
    </div>
  );
};

export default SearchPostList;