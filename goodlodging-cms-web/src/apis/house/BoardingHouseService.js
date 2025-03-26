import axios from "axios";
import { getToken } from "../../utils/service/localStorageService";
import { API_URL } from "../../utils/ApiUrl";
export const fetchAllHouse = async (userId,accessToken) => {
  try {
    console.log("accessToken: ",accessToken)
    const response = await axios.get(`${API_URL}/users/${userId}/boarding-house`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error(error);
  }
};

export const fetchHouse = async (houseId,accessToken) => {
  try {
    console.log('fetch-house')
    const response = await axios.get(`${API_URL}/boarding-houses/${houseId}`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error(error);
  }
};

export const createBoardingHouse = async (houseData,accessToken) => {
  try {
    const response = await axios.post(`${API_URL}/boarding-houses`, houseData, {
      headers: {
        'Content-Type': 'multipart/form-data',
        Authorization: `Bearer ${accessToken}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error(error);
  }
};

export const updateBoardingHouse = async (houseId, houseData,accessToken) => {
  try {
    const response = await axios.put(
      `${API_URL}/boarding-houses/${houseId}`,
      houseData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error(error);
  }
};

export const deleteBoardingHouse = async (houseId,accessToken) => {
  try {
    const response = await axios.delete(
      `${API_URL}/boarding-houses/${houseId}`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error(error);
  }
};
