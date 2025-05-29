import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:3000/api", // Cambiar cuando tengas backend activo
  headers: {
    "Content-Type": "application/json",
  },
});

// ✅ Interceptor para agregar token automáticamente a cada solicitud
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
