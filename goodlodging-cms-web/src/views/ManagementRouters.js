import HomePage from "./user/homepage/HomePage"
import Profile from "./user/profile/Profile"
import { ROUTERS } from "../utils/router/Router"
import PostDetail from "./post/PostDetail";
const managementRouter=[
    {
        path: ROUTERS.USER.HOME,
        element:<HomePage/>
    },
    {
        path: ROUTERS.USER.PROFILE,
        element:<Profile/>
    },
    {
        path:ROUTERS.USER.POST_DETAIL,
        element:<PostDetail/>
    }
]
export default managementRouter;
