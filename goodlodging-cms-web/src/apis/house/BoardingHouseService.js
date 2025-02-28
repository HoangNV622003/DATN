import axios from "axios";
import { getToken } from "../../utils/service/localStorageService";
const API_URL = process.env.API_URL;
const accessToken = getToken();

export const getAllHouse = async (page = 1) => {
  try {
    const response = await axios.get(`${API_URL}/boarding-houses`, {
      params: {
        page,
      },
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error(error);
  }
};

export const getHouse = async (houseId) => {
  try {
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

export const createBoardingHouse = async (houseData) => {
  try {
    const response = await axios.post(`${API_URL}/boarding-houses`, houseData, {
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

export const updateBoardingHouse = async (houseId, houseData) => {
  try {
    const response = await axios.put(
      `${API_URL}/boarding-houses/${houseId}`,
      houseData,
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

export const deleteBoardingHouse = async (houseId) => {
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
