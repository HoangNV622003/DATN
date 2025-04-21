import axios from "axios";
import { API_URL } from "../../constants/ApiConstants";
export const fetchRoomInvoice = async (roomId, accessToken) => {
  return await axios.get(`${API_URL}/invoice`, {
    params: {
      roomId: roomId,
    },
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
};
export const fetchMyRoomInvoice = async (userId, accessToken) => {
  return await axios.get(`${API_URL}/invoice/my-invoice`, {
    params: {
      userId: userId,
    },
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
};
export const createInvoice = async (payload, accessToken) => {
  return await axios.post(`${API_URL}/invoice`, payload, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
  });
}
export const updateInvoice = async (paymentId, payload, accessToken) => {
  return await axios.put(`${API_URL}/invoice/${paymentId}`, payload, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
  });
}
export const confirmPayment = async (paymentId,userId, accessToken) => {

  return await axios.put(`${API_URL}/payment/${paymentId}/confirm`,null,  {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
    params: {
      userId: userId,
    },
  });
  
}
