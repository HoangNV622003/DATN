export const ROUTERS = {
    USER: {
      HOME: "",
      SEARCH:"/search",
      PROFILE: "/profile/*", // Không dùng wildcard
      POST_DETAIL: "/post/:id",
      POST: {
        MANAGEMENT: 'posts',
        CREATE: 'posts/create',
        UPDATE: 'posts/update/:postId',
        DETAIL: 'posts/:postId',
      },
      BOARDING_HOUSE: {
        MANAGEMENT: 'boarding-houses',
        CREATE: 'boarding-houses/create',
        UPDATE: 'boarding-houses/update/:boardingHouseId',
        DETAIL: 'boarding-houses/:boardingHouseId',
      },
      ROOMS: {
        MANAGEMENT: "rooms",
        CREATE: "rooms/create",
        UPDATE: "rooms/update/:roomId",
        DETAIL: "rooms/detail/:roomId",
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