import React from "react";
import ProfileContent from "./user/profile/profileContent/ProfileContent";
import ManagementPost from "./user/profile/post/managementPost/ManagementPost";
import PostDetail from "./user/profile/post/detail/PostDetail";
import ManagementBoardingHouse from "./user/profile/boardingHouse/managementBoardingHouse/ManagementBoardingHouse";
import SaveBoardingHouse from "./user/profile/boardingHouse/saveBoardingHouse/SaveBoardingHouse";
import BoardingHouseDetail from "./user/profile/boardingHouse/boardingHouseDetail/BoardingHouseDetail";
import ManagementRoom from "./user/profile/room/managementRoom/ManagementRoom";
import SaveRoom from "./user/profile/room/saveRoom/SaveRoom";
import RoomDetail from "./user/profile/room/detail/RoomDetail";
import { ROUTERS } from "../utils/router/Router";
import SavePost from './user/profile/post/savePost/SavePost'; // Đảm bảo đường dẫn đúng
import ForRentBoardingHouse from "./user/profile/boardingHouse/managementBoardingHouse/forRent/ForRentBoardingHouse";
import RentingBoardingHouse from "./user/profile/boardingHouse/managementBoardingHouse/renting/RentingBoardingHouse";
import ManagePayments from "./user/profile/boardingHouse/managementBoardingHouse/payment/managePayments/ManagePayments";
import RoomPaymentsHistory from "./user/profile/boardingHouse/managementBoardingHouse/payment/myPaymentsHistory/RoomPaymentsHistory";

const profileRouter = [
  {
    path: "", // Route mặc định cho /profile/:userId
    element: <ProfileContent />,
  },
  {
    path: ROUTERS.USER.POST.MANAGEMENT, // posts
    element: <ManagementPost />,
  },
  {
    path: ROUTERS.USER.POST.CREATE, // posts/create
    element: <SavePost />,
  },
  {
    path: ROUTERS.USER.POST.UPDATE, // posts/update/:postId
    element: <SavePost />,
  },
  {
    path: ROUTERS.USER.POST.DETAIL, // posts/detail/:postId
    element: <PostDetail />,
  },
  {
    path: ROUTERS.USER.BOARDING_HOUSE.MANAGEMENT, // boardingHouse
    element: <ManagementBoardingHouse />,
  },
  {
    path: ROUTERS.USER.BOARDING_HOUSE.FOR_RENT,
    element: <ForRentBoardingHouse/>
  },
  {
    path: ROUTERS.USER.BOARDING_HOUSE.RENTING,
    element: <RentingBoardingHouse/>
  },
  {
    path: ROUTERS.USER.BOARDING_HOUSE.CREATE, // boardingHouse/create
    element: <SaveBoardingHouse />,
  },
  {
    path: ROUTERS.USER.BOARDING_HOUSE.UPDATE, // boardingHouse/update/:boardingHouseId
    element: <SaveBoardingHouse />,
  },
  {
    path: ROUTERS.USER.BOARDING_HOUSE.DETAIL, // boardingHouse/detail/:boardingHouseId
    element: <BoardingHouseDetail />,
  },
  {
    path: ROUTERS.USER.ROOMS.MANAGEMENT, // boardingHouse/:boardingHouseId/rooms
    element: <ManagementRoom />,
  },
  {
    path: ROUTERS.USER.ROOMS.CREATE, // boardingHouse/:boardingHouseId/rooms/create
    element: <SaveRoom />,
  },
  {
    path: ROUTERS.USER.ROOMS.UPDATE, // boardingHouse/:boardingHouseId/rooms/update/:roomId
    element: <SaveRoom />,
  },
  {
    path: ROUTERS.USER.ROOMS.DETAIL, // boardingHouse/:boardingHouseId/rooms/detail/:roomId
    element: <RoomDetail />,
  },
  {
    path: ROUTERS.USER.BOARDING_HOUSE.MANAGEMENT_PAYMENT, // boardingHouse/:boardingHouseId/payment
    element: <ManagePayments />,
  },
  {
    path: ROUTERS.USER.ROOMS.PAYMENT_HISTORY, // boardingHouse/:boardingHouseId/rooms/history-payment/:roomId
    element:<RoomPaymentsHistory/>
  }
];

console.log('ProfileRouter defined:', profileRouter.map(item => ({
  path: item.path,
  element: item.element?.type?.name || 'Unknown'
})));
export default profileRouter;