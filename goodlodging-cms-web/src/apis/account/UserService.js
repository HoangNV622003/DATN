import axios from "axios";
import { API_URL } from "../../utils/ApiUrl";
export const fetchUsers = async (accessToken) => {
  return await axios.get(`${API_URL}/users`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

};

export const getUser = async (id, accessToken) => {
  return await axios.get(`${API_URL}/users/${id}`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    }
  });
}
export const createUser = async (userData) => {
  return await axios.post(`${API_URL}/users`, userData, {
    headers: {
      "Content-Type": "application/json",
    },
  });
};

export const updateUser = async (userId, userData, accessToken) => {
  return await axios.put(`${API_URL}/users/${userId}`, userData, {
    headers: {
      "Content-Type": "multipart/form-data",
      Authorization: `Bearer ${accessToken}`,
    },
  });
};

export const deleteUser = async (userId, accessToken) => {
  return await axios.delete(`${API_URL}/${userId}`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
};

export const fetchMyBoardingHouse = async (userId, accessToken) => {
  return await axios.get(`${API_URL}/${userId}/boarding-house`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  })
}
