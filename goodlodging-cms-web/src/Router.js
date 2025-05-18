import React from "react";
import { Route, Routes, Outlet } from "react-router-dom";
import MasterLayout from "./components/masterLayout/MasterLayout";
import managementRouter from "./views/ManagementRouters";
import sessionRouter from "./views/user/sessions/SessionRouter";
import NotFound from "./components/not-found/NotFound";

const renderRouterUser = () => {
  return (
    <Routes>
      <Route
        element={
          <MasterLayout>
            <Outlet />
          </MasterLayout>
        }
      >
        {managementRouter.map((item, key) => (
          <Route key={key} path={item.path} element={<div className="content">{item.element}</div>} />
        ))}
        {/* Đặt NotFound trong MasterLayout */}
        <Route path="*" element={<div><NotFound/></div>} /></Route>
      {sessionRouter.map((item, key) => (
        <Route key={key} path={item.path} element={<div>{item.element}</div>} />
      ))}
    </Routes>
  );
};

const RouterCustom = () => {
  return renderRouterUser();
};

export default RouterCustom;