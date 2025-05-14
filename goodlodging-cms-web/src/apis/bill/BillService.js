import axios from "axios";
import { API_URL } from "../../constants/ApiConstants";
export const fetchRoomBills = async (roomId, accessToken) => {
  return await axios.get(`${API_URL}/bill`, {
    params: {
      roomId: roomId,
    },
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
};
export const fetchMyRoomBills = async (userId, accessToken) => {
  return await axios.get(`${API_URL}/bill/my-bill`, {
    params: {
      userId: userId,
    },
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
};
export const createBill = async (payload, accessToken) => {
  return await axios.post(`${API_URL}/bill`, payload, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
  });
}
export const updateBill = async (paymentId, payload, accessToken) => {
  return await axios.put(`${API_URL}/bill/${paymentId}`, payload, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
  });
}
export const confirmPayment = async (paymentId,userId, accessToken) => {

  return await axios.put(`${API_URL}/bill/${paymentId}/confirm`,null,  {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
    params: {
      userId: userId,
    },
  });
}
