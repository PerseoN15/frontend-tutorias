import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext'; // asegúrate que la ruta sea correcta

const RutaPrivada = ({ children }) => {
  const { usuario } = useAuth();

  return usuario ? children : <Navigate to="/login" replace />;
};

export default RutaPrivada;
