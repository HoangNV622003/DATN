import axios from "axios";
import { getToken } from "../../utils/service/localStorageService";
import { API_URL } from "../../utils/ApiUrl";
const accessToken = getToken();
export const fetchUsers = async () => {
  try {
    const response = await axios.get(`${API_URL}/users`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getUser=async(id)=>{
  try {
    const response = await axios.get(`${API_URL}/users/${id}`,{
      headers:{
        Authorization:`Bearer ${accessToken}`,
      }
    });
    return response.data;
  } catch (error) {
    throw error;
  }
}
export const createUser = async (userData) => {
  try {
    const response = await axios.post(`${API_URL}/users`, userData, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error(error);
  }
};

export const updateUser = async (userId, userData) => {
  try {
    const response = await axios.put(`${API_URL}/users/${userId}`, userData, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error(error);
  }
};

export const deleteUser = async (userId) => {
  try {
    const response = await axios.delete(`${API_URL}/${userId}`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    return response.data;
  } catch (error) {
    console.log(error);
  }
};
