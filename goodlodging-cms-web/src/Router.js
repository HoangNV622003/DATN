import { Route, Routes } from "react-router-dom";
import MasterLayout from "./components/masterLayout/MasterLayout";
import managementRouter from "./views/ManagementRouters";
import { ROUTERS } from "./utils/router/Router";
import JwtLogin from "./views/user/sessions/JwtLogin"
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

      <Route path={ROUTERS.AUTH.LOGIN} element={<JwtLogin/>} ></Route>
    </Routes>
  );
};
const RouterCustom = () => {
  return renderRouterUser();
};
export default RouterCustom;
