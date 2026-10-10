import axios from "axios";

const apisLogin = axios.create({
    baseURL: "https://backend-reactjs-9wib.onrender.com/api",
    headers: {
        "Content-Type": "application/json",
    },
}); export default apisLogin