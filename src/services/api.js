import axios from "axios";

const API = axios.create({
  baseURL: "https://backend-tutorias.cleverapps.io/api", 
  headers: {
    "Content-Type": "application/json",
  },
});

API.interceptors.request.use(config => {
  const user = JSON.parse(localStorage.getItem('usuario'));
  if (user?.token) {
    config.headers.Authorization = `Bearer ${user.token}`;
  }
  return config;
}, error => {
  return Promise.reject(error);
});

export default API;
