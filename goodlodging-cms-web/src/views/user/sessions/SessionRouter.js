import { ROUTERS } from "../../../utils/router/Router";
import ForgotPassword from "./ForgotPassword/ForgotPassword";
import JwtLogin from "./Login/JwtLogin";
import RegisterForm from "./register/RegisterFrom";
import ResetPassword from "./ResetPassword/ResetPassword";
import VerifyOTP from "./VerifyOTP/VerifyOTP";

const sessionRouter=[
    {
        path:ROUTERS.AUTH.LOGIN,
        element: <JwtLogin/>
    },
    {
        path:ROUTERS.AUTH.REGISTER,
        element: <RegisterForm/>
    },
    {
        path:ROUTERS.AUTH.RESET_PASSWORD,
        element: <ResetPassword/>
    },
    {
        path:ROUTERS.AUTH.FORGOT_PASSWORD,
        element: <ForgotPassword/>
    },
    {
        path:ROUTERS.AUTH.VERIFY_OTP,
        element: <VerifyOTP/>
    }

]
export default sessionRouter;