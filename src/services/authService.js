import API from "./api";

// ✅ Login
export const login = async (nombre, contraseña) => {
  try {
    const response = await API.post("/auth/login", { nombre, contraseña });
    return response.data;
  } catch (error) {
    throw error.response?.data?.message || "Error al iniciar sesión";
  }
};

// ✅ Register
export const register = async ({ nombre, contraseña }) => {
  try {
    const response = await API.post("/auth/register", { nombre, contraseña });
    return response.data;
  } catch (error) {
    throw error.response?.data?.message || "Error al registrar";
  }
};

export const checkUsernameExists = async (nombre) => {
  try {
    const response = await API.get(`/auth/exists/${nombre}`);
    return response.data.existe;
  } catch (error) {
    console.error("Error verificando usuario:", error);
    throw new Error("No se pudo verificar el usuario");
  }
};

