import axios from "axios";
import { API_URL } from "../../utils/ApiUrl"
export const createRoom = async (payload,accessToken) => {
    console.log("token:",accessToken)
    return await axios.post(`${API_URL}/rooms`, payload, {
        headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json"
        }
    });
}

export const updateRoom = async (roomId, payload,accessToken) => {
    return await axios.put(`${API_URL}/rooms/${roomId}`, payload, {
        headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json"
        }
    });
}

export const deleteRoom = async (boardingHouseId, roomId,accessToken) => {
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

export const getRoom = async (roomId,accessToken) => {
    return axios.get(`${API_URL}/rooms/${roomId}`, {
        headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json"
        }
    });
}
export const addUserToRoom = async (payload,accessToken) => {
    return axios.post(`${API_URL}/room-user`, payload, {
        headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json"
        }
    });
}
export const removeUserFromRoom=async(payload,accessToken)=>{
    return axios.delete(`${API_URL}/room-user`,{
        headers:{
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json"
        },
        data:payload
    });
}

export const fetchMyRoom=async(userId,accessToken)=>{
    return axios.get(`${API_URL}/rooms/my-room/${userId}`,
        {
            headers:{
                Authorization: `Bearer ${accessToken}`,
                "Content-Type": "application/json"
            },
        }
    )
}