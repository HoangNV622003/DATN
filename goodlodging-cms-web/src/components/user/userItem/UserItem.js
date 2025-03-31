import React from 'react';
import "./style.scss";
import defaultAvatar from "../../../assets/images/defaultAvatar.jpg"

const UserItem = ({ user, onDelete }) => {
    const { imageUrl, username, firstName, lastName, phone, email, id } = user;
  
    const handleDelete = () => {
      onDelete(id); // Gọi hàm xóa với userId
    };
  
    return (
      <div className='user-item'>
        <img className="user-image" src={imageUrl ? imageUrl : defaultAvatar} alt='' />
        <div className="user-info">
          <p>{username}</p>
          <p>{firstName + ' ' + lastName}</p>
          <p>{phone}</p>
          <p>{email}</p>
        </div>
        <button onClick={handleDelete}>Xóa</button>
      </div>
    );
  };

export default UserItem;