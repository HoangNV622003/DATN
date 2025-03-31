import React from 'react';
import ProfileMenu from '../MenuProfile/ProfileMenu';
import "./profileLayoutStyle.scss";
import { Outlet } from 'react-router-dom';

const ProfileLayout = ({ children }) => {
  return (
    <div className='profile_layout'>
      <div className="container_profile_menu">
        <ProfileMenu />
      </div>
      <div className="container_profile_content">

        <Outlet/>
      </div>
    </div>
  );
};

export default ProfileLayout;