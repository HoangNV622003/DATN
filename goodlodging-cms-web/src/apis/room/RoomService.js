import axios from "axios";
import { API_URL } from "../../utils/ApiUrl"
import { getToken } from "../../utils/service/localStorageService"
const accessToken = getToken();
export const createRoom = async (payload,token) => {
    console.log("token:",accessToken)
    return await axios.post(`${API_URL}/rooms`, payload, {
        headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json"
        }
    });
}

export const updateRoom = async (roomId, payload,token) => {
    return await axios.put(`${API_URL}/rooms/${roomId}`, payload, {
        headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json"
        }
    });
}

export const deleteRoom = async (boardingHouseId, roomId,token) => {
    console.log("accessToken", token)
    const roomIds = [roomId];
    return await axios.delete(`${API_URL}/rooms`, {
        data: {
            ids: roomIds
        },
        params:{
            boardingHouseId
        },
        headers: {
            Authorization: `Bearer ${accessToken}`,
        }
    });
}

export const getRoom = async (roomId,token) => {
    return axios.get(`${API_URL}/rooms/${roomId}`, {
        headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json"
        }
    });
}
export const addUserToRoom = async (payload,token) => {
    return axios.post(`${API_URL}/room-user`, payload, {
        headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json"
        }
    });
}
export const removeUserFromRoom=async(payload,token)=>{
    return axios.delete(`${API_URL}/room-user`,{
        headers:{
            Authorization: `Bearer ${token}`,
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