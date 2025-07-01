import axios from "axios";

const api = axios.create({
  baseURL: "http://172.19.0.8:8082/api",
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;