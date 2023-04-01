import axios from "axios";
import { BASE_URL } from "../components/Constants";

export const authBearer = () => {
    const token = localStorage.getItem('token');
    if (token) {
        return { Authorization: 'Bearer ' + token };
    } else {
        return {};
    }
}


const api = axios.create({ baseURL: BASE_URL });
    const token = authBearer().Authorization;
    console.log(token);
    if(token) {
        api.defaults.headers.common['Authorization'] = token;
    }


export default api;
