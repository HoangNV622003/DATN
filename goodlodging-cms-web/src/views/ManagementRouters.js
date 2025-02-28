import HomePage from "./user/homepage/HomePage"
import Profile from "./user/profile/Profile"
import { ROUTERS } from "../utils/router/Router"
const managementRouter=[
    {
        path: ROUTERS.USER.HOME,
        element:<HomePage/>
    },
    {
        path: ROUTERS.USER.PROFILE,
        element:<Profile/>
    },
]
export default managementRouter;
