import HomePage from "./user/homepage/HomePage";
import RenderProfileRouter from "./user/profile/RenderProfileRouter";
import PostDetail from "./user/post/PostDetail";
import { ROUTERS } from "../utils/router/Router";
import SearchPage from "./user/searchPage/SearchPage";
import FavoritePost from "./user/favoritePost/FavoritePost";
import AuthorPosts from "./user/authorPost/AuthorPosts";

const managementRouter = [
  {
    path: ROUTERS.USER.HOME,
    element: <HomePage />,
  },
  {
    path: ROUTERS.USER.SEARCH,
    element: <SearchPage />,
  },
  {
    path: ROUTERS.USER.PROFILE,
    element: <RenderProfileRouter />,
  },
  {
    path: ROUTERS.USER.POST_DETAIL,
    element: <PostDetail />,
  },
  {
    path: ROUTERS.USER.FAVORITE_POST,
    element: <FavoritePost/>
  },
  {
    path:ROUTERS.USER.AUTHOR_POST,
    element: <AuthorPosts/>
  }
];

export default managementRouter;