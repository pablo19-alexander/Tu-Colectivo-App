import axios from "axios";
import { API_HOST } from "../utils/constants";

export async function GetRouters() {
    try {
        const response = await axios.get(API_HOST);
        return response.data;
    } catch (error) {
        throw new Error(error.response ? error.response.data : error.message);
    }
}
