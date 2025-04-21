import axios from "axios";
import { API_URL } from "../../utils/ApiUrl";
export const fetchFavoritePosts = async (id,accessToken) => {
    return await axios.get(`${API_URL}/favorite-posts/${id}`, {
        headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
        },
    });
};

export const createFavoritePost = async (payload,accessToken) => {
    return await axios.post(`${API_URL}/favorite-posts`, payload, {
        headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
        },
    });
};
export const deleteFavoritePost = async (payload,accessToken) => {
    return await axios.delete(`${API_URL}/favorite-posts`, {
        data: payload,
        headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
        },
    });
};
