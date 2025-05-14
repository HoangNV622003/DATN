import React from 'react';
import { Outlet, Route, Routes} from 'react-router-dom';
import ProfileLayout from '../../../components/masterLayout/ProfileLayout';
import profileRouter from '../../profileRouter';
import ProfileContent from './profileContent/ProfileContent';
const RenderProfileRouter = () => {
  return (
      <Routes>
        <Route 
          element={
            <ProfileLayout>
              <div className="profile_content" style={{maxWidth:'900px'}}>
                <Outlet/>
              </div>
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