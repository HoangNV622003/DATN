import React, { useEffect } from 'react';
import { Outlet, Route, Routes, useNavigate, useParams } from 'react-router-dom';
import ProfileLayout from '../../../components/masterLayout/ProfileLayout';
import profileRouter from '../../profileRouter';
import ProfileContent from './profileContent/ProfileContent';
import { useAuth } from '../../../context/AuthContext';
import { ROUTERS } from '../../../utils/router/Router';
import ChatPopUp from '../../../components/chat/ChatPopUp';
const RenderProfileRouter = () => {
  const navigate=useNavigate();
  const {user,isLogin}=useAuth();
  useEffect(()=>{
    if(!user||!isLogin){
      navigate(`/${ROUTERS.AUTH.LOGIN}`)
    }
  })
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
                <Route path="/chat" element={<ChatPopUp />} />

        <Route path="*" element={<div>Trang con không tìm thấy trong Profile</div>} />
        </Route>
      </Routes>
  );
};

export default RenderProfileRouter;