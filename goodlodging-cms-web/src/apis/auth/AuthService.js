import axios from "axios";
import { getToken } from "../../utils/service/localStorageService";
const API_URL = process.env.API_URL;
const accessToken = getToken;

export const loginUser = async (payload) => {
  try {
    const response = await axios.post(`${API_URL}/auth/token`, payload, {
      headers: {
        "Content-Type": "application/json",
      },
    });
    return response.data;
  } catch (error) {
    console.error(error);
  }
};

//payload => {token}
export const logoutUser = async (payload) => {
  try {
    const response = await axios.post(`${API_URL}/auth/logout`, payload, {
      headers: {
        "Content-Type": "application/json",
      },
    });
    return response.data;
  } catch (error) {
    console.error(error);
  }
};
// payload => {email}
export const resetPasswordInit = async (payload) => {
  try {
    const response = await axios.post(
      `${API_URL}/notifications/otp/send`,
      payload,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error(error);
  }
};
//gọi api xác thực otp => payload => {email,otp}
export const resetPasswordCheck = async (payload) => {
  try {
    const response = await axios.post(
      `${API_URL}/notifications/otp/verify`,
      payload,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error(error);
  }
};

//gọi api tạo mật khẩu mới => payload => {email, newPassword, confirmNewPassword}
export const resetPasswordFinish = async (payload) => {
  try {
    const response = await axios.put(
      `${API_URL}/auth/reset-password`,
      payload,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error(error);
  }
};

export const resendOtp = async (payload) => {
  try {
    const response = await axios.post(
      `${API_URL}/notifications/otp/resend`,
      payload,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error(error);
  }
};

// payload={userId, oldPassword, newPassword, confirmNewPassword}
export const changePassword = async (payload) => {
  try {
    const response = await axios.put(
      `${API_URL}/auth/reset-password`,
      payload,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error(error);
  }
};
