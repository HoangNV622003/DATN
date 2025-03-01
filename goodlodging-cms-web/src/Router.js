import { Route, Routes } from "react-router-dom";
import MasterLayout from "./components/masterLayout/MasterLayout";
import managementRouter from "./views/ManagementRouters";
import sessionRouter from "./views/user/sessions/SessionRouter";
const renderRouterUser = () => {
  return (
    <Routes>
      <Route
        path=""
        element={
          <MasterLayout>
            <Routes>
              {managementRouter.map((item, key) => (
                <Route key={key} path={item.path} element={<div className="body">{item.element}</div>}/>
              ))}
            </Routes>
          </MasterLayout>
        }
      />
      {sessionRouter.map((item, key) => (
                <Route
                    key={key}
                    path={item.path}
                    element={<div>{item.element}</div>}
                />))}

    </Routes>
  );
};
const RouterCustom = () => {
  return renderRouterUser();
};
export default RouterCustom;
