import axios from "axios";
import { API_URL } from "../../utils/ApiUrl"
import { getToken } from "../../utils/service/localStorageService"
const accessToken = getToken();
export const createRoom = async (payload) => {
    return await axios.post(`${API_URL}/rooms`, payload, {
        headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json"
        }
    });
}

export const updateRoom = async (roomId, payload) => {
    return await axios.put(`${API_URL}/rooms/${roomId}`, payload, {
        headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json"
        }
    });
}

export const deleteRoom = async (roomId) => {
    console.log("accessToken", accessToken)
    const roomIds = [roomId];
    return await axios.delete(`${API_URL}/rooms`, {
        data: {
            ids: roomIds
        },
        headers: {
            Authorization: `Bearer ${accessToken}`,
        }
    });
}

export const getRoom = async (roomId) => {
    return axios.get(`${API_URL}/rooms/${roomId}`, {
        headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json"
        }
    });
}
export const addUserToRoom = async (payload) => {
    return axios.post(`${API_URL}/room-user`, payload, {
        headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json"
        }
    });
}
export const removeUserFromRoom=async(payload)=>{
    return axios.delete(`${API_URL}/room-user`,{
        headers:{
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json"
        },
        data:payload
    });
}

export const fetchMyRoom=async(userId)=>{
    console.log("accessToken:",accessToken)
    return axios.get(`${API_URL}/rooms/my-room/${userId}`,
        {
            headers:{
                Authorization: `Bearer ${accessToken}`,
                "Content-Type": "application/json"
            },
        }
    )
}