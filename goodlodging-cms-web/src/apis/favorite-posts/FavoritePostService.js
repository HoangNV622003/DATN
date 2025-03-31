import axios from "axios";
import { API_URL } from "../../utils/ApiUrl";
import { getToken } from "../../utils/service/localStorageService";
const accessToken = getToken();
export const fetchFavoritePosts = async (id) => {
    console.log('accessToken:',accessToken)
    return await axios.get(`${API_URL}/favorite-posts/${id}`, {
        headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
        },
    });
};

export const createFavoritePost = async (payload) => {
    console.log("token:",accessToken)
    return await axios.post(`${API_URL}/favorite-posts`, payload, {
        headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
        },
    });
};
export const deleteFavoritePost = async (payload) => {
    console.log("delete")
    console.log("userId:",payload.userId);
    console.log("postIds:",payload.postIds);
    return await axios.delete(`${API_URL}/favorite-posts`, {
        data: payload,
        headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
        },
    });
};
