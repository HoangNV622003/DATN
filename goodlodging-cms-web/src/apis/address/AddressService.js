import axios from "axios";
import { API_URL } from "../../utils/ApiUrl";
export const fetchAllAddress=async()=>{
    try {
        const response=await axios.get(`${API_URL}/addresses`);
        return response.data;
    } catch (error) {
        throw error;
    }
}