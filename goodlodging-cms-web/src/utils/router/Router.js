export const ROUTERS = {
    USER: {
      HOME: "/",
      SEARCH:"/search",
      PROFILE: "/profile/*", // Không dùng wildcard
      POST_DETAIL: "/post/:id",
      FAVORITE_POST:"/favorite-posts",
      AUTHOR_POST:"/author-posts/:id",
      CHAT:"/chat",
      POST: {
        MANAGEMENT: 'posts',
        CREATE: 'create-post',
        UPDATE: 'update-post/:postId',
        DETAIL: 'posts/:postId',
      },
      BOARDING_HOUSE: {
        RENTING:'renting',
        FOR_RENT:'for-rent',
        MANAGEMENT: 'boarding-houses',
        CREATE: 'create-boarding-house',
        UPDATE: 'update-boarding-house/:boardingHouseId',
        DETAIL: 'boarding-houses/:id',
      },
      ROOMS: {
        MANAGEMENT: "rooms",
        CREATE: "create-room",
        UPDATE: "update-room/:id",
        DETAIL: "room-detail/:id",
      },
    },
    ADMIN: {},
    AUTH: {
      LOGIN: "login",
      REGISTER: "register",
      FORGOT_PASSWORD: "forgot-password",
      VERIFY_OTP: "verify-otp",
      RESET_PASSWORD: "reset-password",
    },
  };