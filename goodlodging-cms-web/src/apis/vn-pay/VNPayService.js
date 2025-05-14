import axios from "axios";
import { API_URL } from "../../constants/ApiConstants";
export const createOrder = async (payload, accessToken) => {
  return await axios.post(`${API_URL}/vn-pay`, payload, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
  });
}
export const fetchOrderResult = async (payload, accessToken) => {
  return await axios.get(`${API_URL}/vn-pay`, {
    params: {
      vnp_ResponseCode:payload.vnp_ResponseCode,
      vnp_OrderInfo:payload.vnp_OrderInfo,
      payerId:payload.payerId,
    },
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
}
