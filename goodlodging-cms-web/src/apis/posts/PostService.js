import axios from "axios";

import { API_URL } from "../../utils/ApiUrl";
export const searchPost = async (page = 0, payload) => {
    try {
        const response = await axios.post(`${API_URL}/posts/search`, payload, {
            params: {
                page
            },
            headers: {
                "Content-Type": "application/json",
            }
        })
        return response.data;
    } catch (error) {
        console.log("ERROR: ", error);
        throw error;
    }
}
export const fetchSuggestedPost = async (payload) => {
    return await axios.get(`${API_URL}/posts/suggested-posts`, {
            params: {
                provinceName:payload.provinceName,
                districtName:payload.districtName,
                wardName:payload.wardName,
            }
        });
}
export const fetchAllPost = async (page = 0) => {
    try {

        const response = await axios.get(`${API_URL}/posts`, {
            params: {
                page
            }
        })
        return response.data;
    } catch (error) {
        throw error;
    }
}
export const createPost = async (payload,accessToken) => {
    try {
        const response = await axios.post(`${API_URL}/posts`, payload, {
            headers: {
                "Content-Type": 'multipart/form-data',
                Authorization: `Bearer ${accessToken}`
            }
        })
        return response.data;
    } catch (error) {
        throw error;
    }
}
export const updatePost = async (id, payload,accessToken) => {
    try {
        const response = await axios.put(`${API_URL}/posts/${id}`, payload, {
            headers: {
                "Content-Type": 'multipart/form-data',
                Authorization: `Bearer ${accessToken}`
            }
        })
        return response.data;
    } catch (error) {
        throw error;
    }
}
export const deletePost = async (payload,accessToken) => {
    try {
        const response = await axios.delete(`${API_URL}/posts/${payload}`, {
            headers: {
                Authorization: `Bearer ${accessToken}`
            }
        })
        return response.data;
    } catch (error) {
        throw error;
    }
}
export const findRoomMate = async (payload, token) => {
    console.log("accessToken", token);
    return await axios.post(`${API_URL}/posts/find-room-mate`, payload, {
        headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`
        }
    })
}
export const getPost = async (id) => {
    return await axios.get(`${API_URL}/posts/${id}`);
}
export const fetchMyPost = async (postId) => {
    try {
        const response = await axios.get(`${API_URL}/posts/my-post/${postId}`, {
            headers: {
                //Authorization:`Bearer ${accessToken}`
            }
        })
        return response.data;
    } catch (error) {
        throw error;
    }
}
export const fetchMyPosts = async (userId) => {
    try {
        console.log("userId", userId)
        const response = await axios.get(`${API_URL}/posts/my-posts/${userId}`, {
            headers: {
                //Authorization:`Bearer ${accessToken}`
            }
        })
        return response.data;
    } catch (error) {
        throw error;
    }
}

export const fetchAuthorInformation = async (id, page = 0) => {
    return (await axios.get(`${API_URL}/posts/author/${id}`, {
        params: {
            page
        }
    })).data;
}