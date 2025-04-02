import axios from "axios";
import { getToken } from "../../utils/service/localStorageService";

import { API_URL } from "../../utils/ApiUrl";
const accessToken=getToken();
export const searchPost=async(page=0,payload)=>{
    try{
        const response=await axios.post(`${API_URL}/posts/search`,payload,{
            params:{
                page
            },
            headers:{
                "Content-Type":"application/json",
            }
        })
        return response.data;
    }catch(error){
        console.log("ERROR: ",error);
        throw error;
    }
}
export const fetchAllPost=async(page=0)=>{
    try{

        const response=await axios.get(`${API_URL}/posts`,{
            params:{
                page
            }
        })
        return response.data;
    }catch(error){
        throw error;
    }
}
export const createPost=async(payload)=>{
    try {
        const response=await axios.post(`${API_URL}/posts`,payload,{
            headers:{
                "Content-Type":'multipart/form-data',
                Authorization:`Bearer ${accessToken}`
            }
        })
        return response.data;
    } catch (error) {
        throw error;
    }
}
export const updatePost=async(id,payload)=>{
    try {
        console.log("accessToken",accessToken);
        const response=await axios.put(`${API_URL}/posts/${id}`,payload,{
            headers:{
                "Content-Type":'multipart/form-data',
                Authorization:`Bearer ${accessToken}`
            }
        })
        return response.data;
    } catch (error) {
        throw error;
    }
}
export const deletePost=async(payload)=>{
    try {
        const response=await axios.delete(`${API_URL}/posts/${payload}`,{
            headers:{
                Authorization:`Bearer ${accessToken}`
            }
        })
        return response.data;
    } catch (error) {
        throw error;
    }
}
export const getPost=async(id)=>{
    try {
        const response=await axios.get(`${API_URL}/posts/${id}`)
        return response.data;
    } catch (error) {
        throw error;
    }
}
export const fetchMyPost =async(postId)=>{
    try {
        const response=await axios.get(`${API_URL}/posts/my-post/${postId}`,{
            headers:{
                //Authorization:`Bearer ${accessToken}`
            }
        })
        return response.data;
    } catch (error) {
        throw error;
    }
}
export const fetchMyPosts=async(userId)=>{
    try {
        const response=await axios.get(`${API_URL}/posts/my-posts/${userId}`,{
            headers:{
                //Authorization:`Bearer ${accessToken}`
            }
        })
        return response.data;
    } catch (error) {
        throw error;
    }
}

export const fetchAuthorInformation=async(id,page=0)=>{
    return (await axios.get(`${API_URL}/posts/author/${id}`,{
        params:{
            page
        }
    })).data;
}