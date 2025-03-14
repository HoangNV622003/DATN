import React from 'react';
import { Outlet, Route, Routes, useParams } from 'react-router-dom';
import ProfileLayout from '../../../components/masterLayout/ProfileLayout';
import profileRouter from '../../profileRouter';
import ProfileContent from './profileContent/ProfileContent';
import ManagementPost from './post/managementPost/ManagementPost';
import SavePost from './post/savePost/SavePost';
import { ROUTERS } from '../../../utils/router/Router';

const RenderProfileRouter = () => {
  const { userId } = useParams(); // Lấy userId từ URL
  console.log('Rendering RenderProfileRouter with userId:', userId);
  console.log('ProfileRouter paths:', profileRouter.map(item => ({
    path: item.path,
    element: item.element?.type?.name || 'Unknown'
  })));

  return (
      <Routes>
        <Route 
          element={
            <ProfileLayout>
              <Outlet/>
            </ProfileLayout>
          } 
        >
        <Route path="/"index element={<ProfileContent />} />
        {
          profileRouter.map((item, index) => (
            <Route key={index} path={item.path} element={item.element} />
          ))
        }
        <Route path="*" element={<div>Trang con không tìm thấy trong Profile</div>} />
        </Route>
      </Routes>
  );
};

export default RenderProfileRouter;