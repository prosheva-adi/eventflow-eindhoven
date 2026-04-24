import axios from "axios";

let _token = null;

export const setToken = (token) => {
    _token = token;
};

export const clearToken = () => {
    _token = null;
};

const api = axios.create({
    baseURL: "http://localhost:8080",
});

api.interceptors.request.use((config) => {
    if (_token) config.headers.Authorization = `Bearer ${_token}`;
    return config;
});

export default api;