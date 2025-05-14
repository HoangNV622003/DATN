import axios from "axios";
import { API_URL } from "../../utils/ApiUrl";
export const loginUser = async (payload) => {
  try {
    const response = await axios.post(`${API_URL}/auth/token`, payload, {
      headers: {
        "Content-Type": "application/json",
      },
    });
    console.log("response: ", response);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const introspectToken = async (payload) => {
  try {
    const response = await axios.post(`${API_URL}/auth/introspect`, payload, {
      headers: {
        "Content-Type": "application/json",
      },
    });
    return response.data;
  } catch (error) {
    throw error;
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
export const verifyOTP = async (payload) => {
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

export const sendOtp = async (payload) => {
  return await axios.post(
    `${API_URL}/notifications/otp/send`,
    payload,
    {
      headers: {
        "Content-Type": "application/json",
      },
    }
  );
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
export const changePassword = async (payload,accessToken) => {
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
