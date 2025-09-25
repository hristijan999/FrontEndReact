import axios from "axios";
axios.defaults.withCredentials = true;
const baseURL = "http://localhost:8080";

export const Register = (mail:string, password:string) => {
    return axios.post(`${baseURL}/Register`, {
        mail,
        password
    });
};

export const LogIn = (mail:string, password:string) => {
    const formData = new URLSearchParams();
    formData.append("username", mail);     // Spring expects "username"
    formData.append("password", password); // Spring expects "password"

    return axios.post(`${baseURL}/login`, formData, {
        withCredentials: true,
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        }
    });
};
export const GetCurrentUser = async () => {
    const response = await axios.get(`${baseURL}/Register/me`, {
        withCredentials: true,
    });
    return response.data;
};



