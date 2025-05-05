import axios from "axios"
import { API_URL } from "../../utils/ApiUrl"
export const sendMessage = async (payload,accessToken) => {
    return await axios.post(`${API_URL}/chat`, payload, {
        headers: {
            "Content-Type": "application/json",
        },
    })

}