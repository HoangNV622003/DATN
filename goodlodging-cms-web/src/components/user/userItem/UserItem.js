import React from 'react';
import "./style.scss";
import defaultAvatar from "../../../assets/images/defaultAvatar.jpg"
import { IMAGE_URL } from '../../../utils/ApiUrl';

const UserItem = ({ user, onDelete }) => {
    const { imageUrl, username, fullName, phoneNumber, email, id } = user;
  
    const handleDelete = () => {
      onDelete(id); // Gọi hàm xóa với userId
    };
  
    return (
      <div className='user-item'>
        <img className="user-image" src={imageUrl ?IMAGE_URL+ imageUrl : defaultAvatar} alt='' />
        <div className="user-info">
          <p>{username}</p>
          <p>{fullName}</p>
          <p>{phoneNumber}</p>
          <p>{email}</p>
        </div>
        <button onClick={handleDelete}>Xóa</button>
      </div>
    );
  };

export default UserItem;