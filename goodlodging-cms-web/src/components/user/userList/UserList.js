import React from 'react';
import UserItem from '../userItem/UserItem';

const UserList = ({ users, onDelete }) => {
    return (
      <div className="container__user__list">
        {users.map((item) => (
          <UserItem key={item.id} user={item} onDelete={onDelete} />
        ))}
      </div>
    );
  };

export default UserList;